const { spawn } = require("node:child_process");
const path = require("node:path");

const exe = "E:\\桌面\\新建文件夹\\local-noauth-build\\微信小店多店铺群控.exe";
const cwd = path.dirname(exe);
const child = spawn(exe, [], { cwd, detached: true, stdio: "ignore" });
child.unref();
console.log("Started local no-auth app:", exe);
