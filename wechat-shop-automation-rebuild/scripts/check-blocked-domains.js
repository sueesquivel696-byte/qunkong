const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "app", "electron");
const blocked = [
  "https://apit.dajiaying.xyz",
  "https://ai.t8star.cn",
  "https://jk.dianxiaolong.net/api/getExpressNo",
];
const allowedMentions = [
  "blockedLegacyHosts",
  "BLOCKED_EXTERNAL_HOSTS",
  "local.invalid",
  "local-disabled://",
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && /\.js$/i.test(entry.name)) out.push(full);
  }
  return out;
}

let failed = false;
for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  for (const needle of blocked) {
    if (text.includes(needle)) {
      console.error("Blocked live URL found:", needle, "in", file);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log("OK: no blocked live third-party URLs found in app/electron.");
console.log("Note: blocked host names may still appear in blocklists or error details, which is expected.");
