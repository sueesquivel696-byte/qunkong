const fs = require('fs');
const files = [
  'E:/桌面/新建文件夹/local-noauth-build/resources/app/electron/main.js',
  'E:/桌面/新建文件夹/wechat-shop-automation-rebuild/app/electron/main.js',
];
const debugFunc = `

function appendMainDebug(message, data = {}) {
  try {
    const logPath = path.join(app.getPath("userData"), "logs", "main-debug.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify({ ts: new Date().toISOString(), message, data }) + "\\n", "utf8");
  } catch (err) {
    try { console.warn("[main-debug] write failed", err.message); } catch {}
  }
}
process.on("uncaughtException", (err) => appendMainDebug("uncaughtException", { message: err.message, stack: err.stack }));
process.on("unhandledRejection", (err) => appendMainDebug("unhandledRejection", { message: err?.message || String(err), stack: err?.stack || "" }));
`;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('main-debug.log')) {
    text = text.replace('configureChromiumCacheLimits(app);', 'configureChromiumCacheLimits(app);' + debugFunc);
    text = text.replace('function createMainWindow() {', 'function createMainWindow() {\n  appendMainDebug("createMainWindow:start");');
    text = text.replace('  mainWindow = new BrowserWindow({', '  appendMainDebug("createMainWindow:before-browserwindow");\n  mainWindow = new BrowserWindow({');
    text = text.replace('  mainWindow.once("ready-to-show", () => {', '  appendMainDebug("createMainWindow:after-browserwindow");\n  mainWindow.once("ready-to-show", () => {\n    appendMainDebug("window:ready-to-show");');
    text = text.replace('  mainWindow.on("closed", () => {', '  mainWindow.on("closed", () => {\n    appendMainDebug("window:closed");');
    text = text.replace('function initializeBackendOnce() {', 'function initializeBackendOnce() {\n  appendMainDebug("initializeBackendOnce:start");');
    text = text.replace('  if (mainWindow && !mainWindow.isDestroyed()) initShopManager(mainWindow);', '  if (mainWindow && !mainWindow.isDestroyed()) { appendMainDebug("initializeBackendOnce:initShopManager"); initShopManager(mainWindow); }');
    text = text.replace('  registerIpcHandlers();', '  appendMainDebug("initializeBackendOnce:registerIpcHandlers");\n  registerIpcHandlers();');
    text = text.replace('  startDaemon();', '  appendMainDebug("initializeBackendOnce:startDaemon");\n  startDaemon();');
    text = text.replace('function loadMainWindow(win) {', 'function loadMainWindow(win) {\n  appendMainDebug("loadMainWindow:start");');
    text = text.replace('      win.loadFile(path.join(__dirname, "../dist/index.html"));', '      const indexPath = path.join(__dirname, "../dist/index.html");\n      appendMainDebug("loadMainWindow:loadFile", { indexPath });\n      win.webContents.once("did-start-loading", () => appendMainDebug("window:did-start-loading"));\n      win.loadFile(indexPath);');
    text = text.replace('  app.whenReady().then(() => {', '  app.whenReady().then(() => {\n    appendMainDebug("app:ready");');
    text = text.replace('    createMainWindow();', '    appendMainDebug("app:before-createMainWindow");\n    createMainWindow();\n    appendMainDebug("app:after-createMainWindow");');
    fs.writeFileSync(file, text, 'utf8');
  }
  new Function(fs.readFileSync(file, 'utf8'));
  console.log('patched/syntax ok', file);
}
