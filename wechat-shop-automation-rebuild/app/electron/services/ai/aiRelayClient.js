const IMAGE_GENERATION_TIMEOUT_MS = 600000;

function ok(data = {}, meta = {}) {
  return { ok: true, data, error: null, raw: meta.raw || null, meta: meta.meta || {} };
}

function fail(code, message, details = {}, retryable = false, raw = null) {
  return { ok: false, data: null, error: { code, message, details, retryable }, raw };
}

function parseJsonObject(text = "") {
  const value = String(text || "").trim();
  if (!value) {
    const err = new Error("AI response did not contain text output");
    err.code = "AI_SPLIT_EMPTY_OUTPUT";
    throw err;
  }
  return JSON.parse(value);
}

function extractOutputText(response = {}) {
  if (typeof response.output_text === "string") return response.output_text;
  if (typeof response.text === "string") return response.text;
  return "";
}

function disabled(feature) {
  return fail(
    "THIRD_PARTY_AI_DISABLED",
    `${feature} 已禁用：旧版本默认使用未知第三方 AI 接口。请接入公司自有 AI API 后再启用。`,
    {
      blockedLegacyHosts: ["ai.t8star.cn"],
      reason: "公司本地版默认禁止访问离职程序员或未知第三方 AI 服务。",
    },
    false
  );
}

function createAiRelayClient() {
  return {
    createJsonResponse() {
      return Promise.resolve(disabled("AI 文案/JSON 生成"));
    },
    generateImage() {
      return Promise.resolve(disabled("AI 作图"));
    },
    probeText() {
      return Promise.resolve(disabled("AI 文本探测"));
    },
    probeJson() {
      return Promise.resolve(disabled("AI JSON 探测"));
    },
    probeImage() {
      return Promise.resolve(disabled("AI 图片探测"));
    },
  };
}

module.exports = {
  IMAGE_GENERATION_TIMEOUT_MS,
  createAiRelayClient,
  parseJsonObject,
  extractOutputText,
};
