# CHANGELOG.md

## 2026-06-27

### Added

- 从 Electron `app.asar` 恢复出 `recovered-source`。
- 创建 `wechat-shop-automation-rebuild` 重建工程骨架。
- 创建 `local-noauth-build` 本地无授权运行版。
- 创建用户数据备份：`wechat-shop-automation-userData-backup-20260627-002340.zip`。
- 新增安全说明文档 `SECURITY-HARDENING.md`。
- 新增服务器依赖审计 `SERVER-DEPENDENCIES.md`。
- 新增重建规划 `REBUILD-PLAN.md`。
- 新增项目约束文档 `AGENTS.md`。
- 新增项目规格文档 `PROJECT_SPEC.md`。

### Changed

- 本地无授权版取消旧授权启动流程。
- 本地无授权版默认禁用旧授权服务器 `apit.dajiaying.xyz`。
- 本地无授权版默认禁用未知 AI 接口 `ai.t8star.cn`。
- 本地无授权版默认禁用未知快递补发接口 `jk.dianxiaolong.net`。

### Security

- 标记离职程序员/未知第三方域名为禁止依赖。
- 保留微信官方业务域名，不做误拦截。
- 发现远程软件向日葵、UU远程，但用户确认远程软件为自己所有，因此不处理。

### 2026-06-27 Continued

#### Added

- 创建桌面快捷方式：`E:\桌面\微信小店群控-本地无授权版.lnk`。
- 创建项目文件夹快捷方式：`E:\桌面\新建文件夹\微信小店群控-本地无授权版.lnk`。
- 下载便携 Node.js：`E:\桌面\新建文件夹\tools\node-v20.19.5-win-x64`。
- 新增 `scripts/start-local.js`。
- 新增 `scripts/check-blocked-domains.js`。

#### Changed

- `aiRelayClient.js` 已改为禁用实现，AI 文案/AI 作图不再访问未知第三方接口。
- `reshipExpressNumberService.js` 已改为禁用实现，快递补发提号不再访问未知第三方接口。
- 本地无授权版已重启验证。

#### Verified

- `node scripts/check-blocked-domains.js` 检查通过。
- `local-noauth-build/resources/app/electron` 中不存在以下 live URL：
  - `https://apit.dajiaying.xyz`
  - `https://ai.t8star.cn`
  - `https://jk.dianxiaolong.net`
- 本地授权服务端口 `32983` 未监听，本地无授权版可启动。

#### Safety Cleanup

- 将旧快捷方式 `WechatShopAutomation_1.0.0 - 快捷方式.lnk` 改名为 `旧版不要使用-会走原授权逻辑.lnk`，避免误点旧版外层程序。

#### Fix

- 修复 `app/electron/main.js` 中错误的字面量 `` `r`n ``，该错误会导致本地无授权版启动后窗口标题显示 `Error`。

#### Verification

- 通过桌面快捷方式 `E:\桌面\微信小店群控-本地无授权版.lnk` 模拟双击启动。
- 验证快捷方式目标为 `E:\桌面\新建文件夹\local-noauth-build\微信小店多店铺群控.exe`。
- 验证启动后的主窗口标题为 `微信小店多店铺自动化群控`，不是 `Error`。
- 验证端口 `32983` 未监听。
- 验证 blocked live URL 命中数为 0。

#### White Screen Fix

- 用户反馈“打开后白屏”，此前只验证进程/窗口标题不充分。
- 新增主进程和渲染进程启动诊断日志：`main-debug.log`、`renderer-debug.log`。
- 定位到渲染错误：`dist/assets/index-Djj7DpyR.js` 报 `Uncaught SyntaxError: Unexpected identifier '_'`。
- 从原始 `app_asar_unpacked` 恢复前端入口 JS，并用 Node UTF-8 安全替换旧 AI URL。
- 修复日志探针中 `win is not defined` 的变量错误。

#### Real Rendering Verification

- 通过桌面快捷方式模拟双击启动。
- `renderer-debug.log` 记录 `bodyHtmlLength=115554`、`appHtmlLength=114894`。
- 页面文本包含“多店铺状态看板、店铺管理、订单管理、商品管理、云商品库、广告推广、素材中心”等。
- 截图证据：`reports/double-click-visual-verification-20260627.png`。

## 2026-06-27 功能探索文档

- 新增 `docs/function-exploration/` 文档集，记录当前项目资产、启动入口、功能地图、前后端链路、外部依赖风险和后续维护建议。
- 明确当前主维护目录是 `wechat-shop-automation-rebuild`，当前运行产物是 `local-noauth-build`，前端仍是打包产物而非原始 Vue 源码。
- 明确高风险功能包括商品批量下架、商品发布队列、补发订单、OpenAPI 凭据保存和删除类操作。
- 本次没有修改业务代码，没有触发真实微信小店操作。
