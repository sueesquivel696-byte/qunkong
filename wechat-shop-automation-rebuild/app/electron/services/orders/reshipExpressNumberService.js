const crypto = require("crypto");

const EXPRESS_NO_URL = "local-disabled://company-owned-express-api-required";
const MODULE_NAME = "reship-express-number";

function ok(data = {}, meta = {}) {
  return { ok: true, module: MODULE_NAME, data, error: null, ...meta };
}

function fail(code, message, details = {}, retryable = false, meta = {}) {
  return { ok: false, module: MODULE_NAME, data: null, error: { code, message, details, retryable }, ...meta };
}

function asString(value) {
  return String(value || "").trim();
}

function encodeSorted(params = {}) {
  return Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key).replace(/%20/g, "+")}=${encodeURIComponent(String(params[key])).replace(/%20/g, "+")}`)
    .join("&");
}

function decodeForm(value = "") {
  return decodeURIComponent(String(value || "").replace(/\+/g, " "));
}

function buildExpressNoSign({ appkey, echostr, timestamp, secret }) {
  const normalized = decodeForm(encodeSorted({ appkey: asString(appkey), echostr: asString(echostr), timestamp: String(timestamp || "").trim() }));
  const md5 = crypto.createHash("md5").update(normalized).digest("hex").toUpperCase();
  return crypto.createHmac("sha256", asString(secret)).update(md5).digest("hex");
}

const provinceMap = new Map([
  ["北京", "北京市"], ["北京市", "北京市"],
  ["上海", "上海市"], ["上海市", "上海市"],
  ["天津", "天津市"], ["天津市", "天津市"],
  ["重庆", "重庆市"], ["重庆市", "重庆市"],
]);

function normalizeExpressAddress(value) {
  const text = asString(value);
  if (!text) return "";
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    parts[0] = provinceMap.get(parts[0]) || parts[0];
    return parts.join("");
  }
  const compact = text.replace(/\s+/g, "");
  for (const province of new Set(provinceMap.values())) {
    if (compact.startsWith(province)) return compact;
  }
  for (const [shortName, fullName] of provinceMap.entries()) {
    if (compact === shortName || compact.startsWith(shortName)) return `${fullName}${compact.slice(shortName.length)}`;
  }
  return compact;
}

function normalizeOrderTime(value) {
  const text = asString(value);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(text)) return `${text}:00`;
  return "";
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatDateTime(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

function getYesterdayMidnightOrderTime(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  return formatDateTime(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0, 0));
}

function createReshipExpressNumberService({ configStore } = {}) {
  function getConfig() {
    if (configStore && typeof configStore.loadPublicConfig === "function") {
      const current = configStore.loadPublicConfig();
      return ok({ ...current, configured: false, disabled: true, disabledReason: "第三方提号接口已从本地版禁用" });
    }
    return ok({ configured: false, disabled: true, appkey: "", appkeyMasked: "", hasSecret: false, updatedAt: "", createdAt: "" });
  }

  function saveConfig() {
    return fail(
      "THIRD_PARTY_EXPRESS_API_DISABLED",
      "快递补发提号接口已禁用：旧版本使用未知第三方接口。请接入公司自有接口或改为手动填写单号。",
      { blockedLegacyHosts: ["jk.dianxiaolong.net"], endpoint: EXPRESS_NO_URL },
      false
    );
  }

  async function fetchExpressNo(input = {}, maybeInput = {}, context = {}) {
    const traceId = context && context.traceId ? context.traceId : "";
    return fail(
      "THIRD_PARTY_EXPRESS_API_DISABLED",
      "快递补发提号接口已禁用：旧版本使用未知第三方接口。请接入公司自有接口或手动填写快递单号。",
      { blockedLegacyHosts: ["jk.dianxiaolong.net"], endpoint: EXPRESS_NO_URL },
      false,
      { traceId }
    );
  }

  return { getConfig, saveConfig, fetchExpressNo };
}

module.exports = {
  EXPRESS_NO_URL,
  buildExpressNoSign,
  normalizeExpressAddress,
  normalizeOrderTime,
  getYesterdayMidnightOrderTime,
  createReshipExpressNumberService,
};
