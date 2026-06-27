# PROJECT_SPEC.md

## 背景

原软件由离职程序员交付，仅留下 Electron 打包产物，原始源码被删除。原软件启动依赖第三方授权服务器，服务器失效后会导致软件无法进入系统。

## 最终目标

构建一套公司完全可控的本地微信小店群控软件：

- 双击即可打开。
- 不需要授权码。
- 不访问离职程序员的授权服务器。
- 不默认访问未知第三方 AI / 快递接口。
- 保留微信小店官方后台相关功能。
- 后续可继续开发、重构、重新打包。

## 当前架构

当前软件是 Electron 应用：

- 主进程：`app/electron/`
- 前端打包产物：`app/dist/`
- 公共数据：`app/shared/`
- 旧用户数据目录：`C:\Users\Admin\AppData\Roaming\wechat-shop-automation`

## 本地无授权版

本地无授权版目录：

- `E:\桌面\新建文件夹\local-noauth-build`

核心修改：

1. `main.js` 不再创建旧 `appAuthManager`。
2. `get-app-auth-status` 返回本地已授权状态。
3. 第三方域名拦截列表阻断未知服务。
4. AI 和快递第三方服务默认禁用。

## 功能边界

### 必须保留

- 店铺列表
- 微信小店登录态管理
- Cookie/session 保存
- 微信官方店铺/订单/商品/财务/广告接口
- 本地缓存和任务记录

### 必须移除或默认禁用

- 授权码登录
- `apit.dajiaying.xyz`
- `ai.t8star.cn`
- `jk.dianxiaolong.net`

### 后续可重建

- 公司自己的 AI 作图/文案接口
- 公司自己的快递补发接口
- 可重新打包安装包
- 原生 Vue 前端源码

## 安全要求

1. 不删除旧用户数据。
2. 修改前备份关键文件。
3. 不阻断微信官方域名。
4. 所有外部服务必须可解释、可配置、可替换。
5. 若发现远程控制软件，先确认归属，不擅自卸载。

## 第三方功能禁用策略

当前版本将 AI 作图/文案和快递补发提号全部视为可选外部扩展。只要没有接入公司自有 API，就必须返回禁用提示，不能调用旧接口或未知接口。

禁用服务文件：

- `app/electron/services/ai/aiRelayClient.js`
- `app/electron/services/orders/reshipExpressNumberService.js`

恢复这些功能时必须满足：

1. API 域名归公司控制，或合同明确可用。
2. API Key 不写死在代码里。
3. 配置和调用文档写入项目文档。
4. 更新 `scripts/check-blocked-domains.js` 的检查规则。
