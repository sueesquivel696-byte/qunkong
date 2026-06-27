const missingApiWarning = '当前未运行在 Electron 环境，window.electronAPI 不可用。';

export function getElectronApi() {
  return globalThis.window?.electronAPI || null;
}

export function isElectronApiAvailable() {
  return Boolean(getElectronApi());
}

export async function invokeElectronApi(methodName, fallbackValue, ...args) {
  const api = getElectronApi();
  const method = api?.[methodName];
  if (typeof method !== 'function') {
    console.warn(`[renderer] ${missingApiWarning} 缺少方法：${methodName}`);
    return fallbackValue;
  }
  return method(...args);
}

export function subscribeElectronApi(eventName, handler) {
  const api = getElectronApi();
  const method = api?.[eventName];
  if (typeof method !== 'function') {
    return () => {};
  }
  return method(handler);
}
