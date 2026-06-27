# wechat-shop-automation-rebuild

这是从上个程序员留下的 Electron 打包程序中恢复出来的本地重建工程。

## 当前目标

- 公司内部本地使用
- 不依赖上个程序员的授权服务器
- 不需要授权码登录
- 保留微信小店官方接口能力
- 逐步把打包产物恢复成可维护源码

## 当前状态

- `app/electron/`：主进程、IPC、业务服务代码，已经是可读 JS，可作为后续维护重点。
- `app/dist/`：前端 Vue 打包产物，不是原始 `.vue` 源码，需要逐步重写。
- `app/electron/main.js`：已改成本地无授权入口。
- 已默认禁用：`apit.dajiaying.xyz`、`ai.t8star.cn`、`jk.dianxiaolong.net`。

## 启动

当前先用：

```bat
run-local.bat
```

实际运行目录是：

`E:\桌面\新建文件夹\local-noauth-build`

## 后续开发路线

1. 安装 Node.js、Git、VS Code。
2. 补齐 Electron/Vite/Vue 依赖。
3. 把 `app/electron/` 整理为 `electron/`。
4. 新建 `src/`，逐步重写 Vue 页面。
5. 先恢复店铺列表、数据概览、订单管理、商品管理。
6. 使用 electron-builder 重新打包。

## 数据目录

旧数据目录仍然沿用：

`C:\Users\Admin\AppData\Roaming\wechat-shop-automation`

已备份：

`E:\桌面\新建文件夹\wechat-shop-automation-userData-backup-20260627-002340.zip`

## 当前可直接双击入口

优先使用桌面快捷方式：

- `E:\桌面\微信小店群控-本地无授权版.lnk`

项目文件夹内也有快捷方式：

- `E:\桌面\新建文件夹\微信小店群控-本地无授权版.lnk`

实际运行程序：

- `E:\桌面\新建文件夹\local-noauth-build\微信小店多店铺群控.exe`

## 已禁用的第三方功能

以下功能已从代码层面禁用，不会向旧第三方接口发请求：

- 授权码登录 / 旧授权服务器：`apit.dajiaying.xyz`
- AI 作图 / AI 文案默认第三方接口：`ai.t8star.cn`
- 快递补发提号第三方接口：`jk.dianxiaolong.net`

如果后续公司需要 AI 作图或快递补发，需要接入公司自有接口后重新启用。

## 开发工具

已下载便携 Node.js，不需要管理员权限：

- `E:\桌面\新建文件夹\tools\node-v20.19.5-win-x64`
- Node: `v20.19.5`
- npm: `10.8.2`

已添加脚本：

```bat
node scripts/check-blocked-domains.js
node scripts/start-local.js
```

说明：npm 安装 Electron 二进制时网络下载卡住，已停止；当前运行版使用现有 Electron runtime。后续重新打包时再补完整 Electron/electron-builder 安装。

## 双击验证记录

2026-06-27 已验证桌面快捷方式可直接打开：

- 快捷方式：`E:\桌面\微信小店群控-本地无授权版.lnk`
- 指向目标：`E:\桌面\新建文件夹\local-noauth-build\微信小店多店铺群控.exe`
- 工作目录：`E:\桌面\新建文件夹\local-noauth-build`
- 启动后主窗口标题：`微信小店多店铺自动化群控`
- 本地授权端口 `32983` 未监听，说明不依赖本地授权服务。

曾发现 `main.js` 中存在错误的字面量 `` `r`n `` 导致窗口标题为 `Error`，已修复并重新验证通过。

## 2026-06-27 白屏修复与真实渲染验证

用户反馈此前验证不充分，实际打开后白屏。重新排查后发现两个问题：

1. `main.js` 日志/拦截 patch 中曾引入错误，导致窗口无法完整加载。
2. 前端打包文件 `dist/assets/index-Djj7DpyR.js` 曾被 PowerShell 文本读写破坏编码/语法，导致 `Uncaught SyntaxError: Unexpected identifier '_'`。

修复方式：

- 从原始解包目录 `app_asar_unpacked` 恢复 `index-Djj7DpyR.js`。
- 使用 Node.js 按 UTF-8 安全替换旧 AI 地址为 `https://local.invalid/blocked-ai`。
- 修复 `main.js` 中日志探针变量错误。
- 加入 `main-debug.log` 和 `renderer-debug.log` 启动/渲染诊断，便于后续排查。

真实验证结果：

- 通过桌面快捷方式 `E:\桌面\微信小店群控-本地无授权版.lnk` 启动。
- 主窗口标题：`微信小店多店铺自动化群控`。
- 渲染日志中 `appHtmlLength=114894`，`bodyText` 包含“多店铺状态看板/店铺管理/订单管理”等页面内容。
- 已保存截图证据：`E:\桌面\新建文件夹\wechat-shop-automation-rebuild\reports\double-click-visual-verification-20260627.png`。

结论：已验证不是白屏，页面实际渲染出店铺看板。

## 2026-06-27 功能探索文档

已新增功能探索文档目录：

`docs/function-exploration/`

内容包括：

- 项目资产盘点
- 启动入口和运行链路
- 功能地图
- 页面到后端链路
- 外部依赖和风险清单
- 后续维护开发建议

本次仅整理文档和风险边界，没有修改业务代码，也没有触发真实微信小店操作。

## 2026-06-27 安全与开发规范

已新增安全和开发规范文档：

- `docs/safety/高风险功能保护清单.md`
- `docs/development/后续开发任务池.md`
- `docs/development/前端源码重建路线图.md`
- `docs/development/开发和提交规则.md`

后续涉及真实微信小店商品、订单、补发、凭据、删除和财务成本的功能，必须先参考高风险功能保护清单。后续提交默认遵守开发和提交规则：只提交本次相关源码、脚本、文档，不上传运行产物、日志、用户数据、备份和敏感信息。

## 2026-06-27 ShopList 前端源码重建起步

已新增独立的前端源码重建入口，第一版重建页面为 `ShopList` 店铺列表：

- `src/renderer/views/ShopList.vue`
- `src/renderer/composables/useShopList.js`
- `src/renderer/components/ShopGroupBar.vue`
- `src/renderer/components/ShopCard.vue`
- `src/renderer/components/ShopTable.vue`
- `src/renderer/api/electronApi.js`
- `vite.renderer.config.js`
- `index.renderer.html`

本次没有覆盖当前运行版 `app/dist`，构建输出为 `renderer-dist/`，仅用于预览验证并已加入 `.gitignore`。

验证命令：

```powershell
npm run build:renderer
```

详细记录见：

`docs/development/ShopList源码重建记录.md`
