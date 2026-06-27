const { app, BrowserWindow, Menu, dialog, session } = require("electron");
const path = require("path");
const fs = require("fs");
const { installProcessOutputGuard } = require("./services/processOutputGuard.js");
const { initShopManager, shutdownShopManager } = require("./controllers/shopManager.js");
const { startDaemon, shutdownSyncManager } = require("./controllers/syncManager.js");
const { shutdownAdProductManager } = require("./controllers/adProductManager.js");
const { registerAppAuthHandlers } = require("./ipc/appAuthHandlers.js");
const { registerWindowControlHandlers } = require("./ipc/windowHandlers.js");
const { configureChromiumCacheLimits, cleanupRuntimeCacheAsync, clearWindowSessionCache } = require("./services/cacheMaintenance.js");

let mainWindow = null;
let shuttingDown = false;
let closingConfirmed = false;
let cleanupTimer = null;
let initialized = false;
const EXIT_TIMEOUT_MS = 3000;

installProcessOutputGuard();
configureChromiumCacheLimits(app);

function appendMainDebug(message, data = {}) {
  try {
    const logPath = path.join(app.getPath("userData"), "logs", "main-debug.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify({ ts: new Date().toISOString(), message, data }) + "\n", "utf8");
  } catch (err) {
    try { console.warn("[main-debug] write failed", err.message); } catch {}
  }
}
process.on("uncaughtException", (err) => appendMainDebug("uncaughtException", { message: err.message, stack: err.stack }));
process.on("unhandledRejection", (err) => appendMainDebug("unhandledRejection", { message: err?.message || String(err), stack: err?.stack || "" }));



const BLOCKED_EXTERNAL_HOSTS = new Set([
  "apit.dajiaying.xyz",
  "ai.t8star.cn",
  "jk.dianxiaolong.net",
]);

function installExternalHostBlock() {
  try {
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      try {
        const host = new URL(details.url).hostname.toLowerCase();
        if (BLOCKED_EXTERNAL_HOSTS.has(host)) {
          console.warn("[Security] Blocked external host:", host, details.url);
          callback({ cancel: true });
          return;
        }
      } catch {}
      callback({ cancel: false });
    });
  } catch (err) {
    console.warn("[Security] Failed to install external host block:", err.message);
  }
}
const gotLock = app.requestSingleInstanceLock();

const localAuthManager = {
  getStatus() {
    return {
      serverReady: true,
      authenticated: true,
      error: null,
      lastHeartbeatAt: new Date().toISOString(),
    };
  },
  async login() {
    return { ok: true, data: this.getStatus() };
  },
  setMainWindow() {},
  shutdown() {},
};

function shutdownAll() {
  if (shuttingDown) return;
  shuttingDown = true;
  try { shutdownSyncManager(); } catch (err) { console.warn("[Shutdown] Stop sync manager failed:", err.message); }
  try { shutdownAdProductManager(); } catch (err) { console.warn("[Shutdown] Stop ad product manager failed:", err.message); }
  if (cleanupTimer) { clearTimeout(cleanupTimer); cleanupTimer = null; }
  try { shutdownShopManager(); } catch (err) { console.warn("[Shutdown] Stop shop manager failed:", err.message); }
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.destroy();
  }
}

function scheduleExitFallback() {
  setTimeout(() => app.exit(0), EXIT_TIMEOUT_MS).unref?.();
}

function shouldConfirmClose() {
  return !(process.env.LIFECYCLE_PROBE === "1" || process.env.UI_PROBE === "1" || process.env.PACKAGED_PROCESSED_PROBE === "1");
}

function initializeBackendOnce() {
  appendMainDebug("initializeBackendOnce:start");
  if (initialized) return;
  initialized = true;
  if (mainWindow && !mainWindow.isDestroyed()) { appendMainDebug("initializeBackendOnce:initShopManager"); initShopManager(mainWindow); }
  const { registerIpcHandlers } = require("./ipc/registerHandlers.js");
  appendMainDebug("initializeBackendOnce:registerIpcHandlers");
  registerIpcHandlers();
  appendMainDebug("initializeBackendOnce:startDaemon");
  startDaemon();
  cleanupTimer = setTimeout(() => {
    cleanupRuntimeCacheAsync(app.getPath("userData")).catch((err) => console.warn("[CacheCleanup] Async cleanup failed:", err.message));
  }, 30 * 1000);
  cleanupTimer.unref?.();
}


function appendRendererDebug(message, data = {}) {
  try {
    const logPath = path.join(app.getPath("userData"), "logs", "renderer-debug.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify({ ts: new Date().toISOString(), message, data }) + "\n", "utf8");
  } catch {}
}
function loadMainWindow(win) {
  appendMainDebug("loadMainWindow:start");
  clearWindowSessionCache(win).finally(() => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL);
      win.webContents.openDevTools();
    } else {
      const indexPath = path.join(__dirname, "../dist/index.html");
      appendMainDebug("loadMainWindow:loadFile", { indexPath });
      win.webContents.once("did-start-loading", () => appendMainDebug("window:did-start-loading"));
      win.loadFile(indexPath);
    }
  });
}

function createMainWindow() {
  appendMainDebug("createMainWindow:start");
  closingConfirmed = false;
  appendMainDebug("createMainWindow:before-browserwindow");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "微信小店多店铺自动化群控-本地无授权版",
    frame: false,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#f3f7fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  appendMainDebug("createMainWindow:after-browserwindow");
  mainWindow.once("ready-to-show", () => {
    appendMainDebug("window:ready-to-show");
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.maximize();
    mainWindow.show();
  });


  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    appendRendererDebug("did-fail-load", { errorCode, errorDescription, validatedURL });
  });
  mainWindow.webContents.on("render-process-gone", (event, details) => {
    appendRendererDebug("render-process-gone", details || {});
  });
  mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
    appendRendererDebug("console-message", { level, message, line, sourceId });
  });
  mainWindow.webContents.on("did-finish-load", () => {
    appendRendererDebug("did-finish-load", { url: mainWindow.webContents.getURL() });
    setTimeout(() => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      mainWindow.webContents.executeJavaScript(`(() => ({
        title: document.title,
        url: location.href,
        bodyText: (document.body && document.body.innerText || '').slice(0, 1000),
        bodyHtmlLength: document.body ? document.body.innerHTML.length : 0,
        appHtmlLength: document.querySelector('#app') ? document.querySelector('#app').innerHTML.length : -1,
        appText: document.querySelector('#app') ? document.querySelector('#app').innerText.slice(0, 1000) : '',
        scripts: Array.from(document.scripts).map(s => s.src || '[inline]').slice(0, 20)
      }))()`, true).then((state) => appendRendererDebug("dom-state", state)).catch((err) => appendRendererDebug("dom-state-error", { message: err.message }));
    }, 2500);
  });
  mainWindow.on("close", (event) => {
    if (shuttingDown || closingConfirmed) return;
    if (!shouldConfirmClose()) { closingConfirmed = true; return; }
    const result = dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["取消", "确认关闭"],
      defaultId: 0,
      cancelId: 0,
      title: "确认关闭",
      message: "确定要关闭软件吗？",
      detail: "确认后将退出微信小店多店铺自动化群控。",
    });
    if (result !== 1) {
      event.preventDefault();
      return;
    }
    closingConfirmed = true;
  });

  mainWindow.on("closed", () => {
    appendMainDebug("window:closed");
    mainWindow = null;
    if (!shuttingDown) {
      shutdownAll();
      app.quit();
    }
  });

  initializeBackendOnce();
  loadMainWindow(mainWindow);
}

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    appendMainDebug("app:ready");
    Menu.setApplicationMenu(null);
    installExternalHostBlock();
    registerAppAuthHandlers(localAuthManager);
    registerWindowControlHandlers();
    appendMainDebug("app:before-createMainWindow");
    createMainWindow();
    appendMainDebug("app:after-createMainWindow");
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  app.on("before-quit", () => { shutdownAll(); scheduleExitFallback(); });
  app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}




