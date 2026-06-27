# 微信小店群控软件重建规划

## 1. 当前状态

现有软件已经从 Electron 打包产物 `app.asar` 解包，恢复目录：

- `E:\桌面\新建文件夹\recovered-source\app`

当前可运行版本：

- `D:\5.13最新群控\win-unpacked\微信小店多店铺群控.exe`

当前临时本地授权服务：

- `E:\桌面\新建文件夹\local-auth-server.ps1`

## 2. 软件大体架构

这是一个 Electron 桌面软件：

```text
Electron 主进程
  ├─ 打开主窗口 / 管理 BrowserWindow / BrowserView
  ├─ 管理微信小店登录态、Cookie、店铺切换
  ├─ 调用微信小店网页接口
  ├─ 本地保存店铺、订单、商品、缓存、任务
  ├─ 对前端暴露 IPC 接口
  └─ 启动时检查软件授权

前端页面 Vue 打包产物
  ├─ 店铺列表
  ├─ 数据概览
  ├─ 订单管理
  ├─ 商品管理
  ├─ 云商品库
  ├─ 发布任务
  ├─ 财务/成本
  ├─ 广告投放
  ├─ AI 商品裂变
  └─ 素材中心
```

## 3. 关键目录

```text
app/electron/main.js                         Electron 主入口
app/electron/preload.js                      前端桥接 preload
app/electron/controllers/                    各业务控制器
app/electron/ipc/                            IPC 处理器
app/electron/services/                       主要业务逻辑
app/electron/services/shopApi/               微信小店接口封装
app/electron/services/shopData/              店铺数据模块
app/electron/services/orders/                订单相关
app/electron/services/products/              商品/云商品/发布/素材/AI裂变
app/electron/services/ai/                    AI 相关配置和调用
app/dist/assets/                             前端打包后的页面代码
shared/                                      公共数据，如快递公司列表
```

## 4. 已发现的外部依赖

### 4.1 软件授权服务器

原服务器：

- `https://apit.dajiaying.xyz`

接口：

- `/api/bootstrap`
- `/api/login`
- `/api/heartbeat`

用途：启动软件前校验授权码、设备、版本、心跳。

当前处理：已临时替换成本机授权服务 `http://localhost:32983`。

后续建议：重建新版时直接移除这套授权模块，或者改成你自己可控的授权模块。

### 4.2 微信小店官方网页/接口

主要域名：

- `https://store.weixin.qq.com`
- `https://shop-promotion.qq.com`
- `https://api.weixin.qq.com`

用途：店铺登录、店铺切换、订单、商品、财务、广告、活动等。

重要说明：这些不是上个程序员自己的服务器，而是微信小店官方后台接口/网页接口。软件依赖你本机登录微信小店后的 Cookie 和请求头。

### 4.3 AI 商品裂变接口

发现默认地址：

- `https://ai.t8star.cn/v1`

相关文件：

- `app/electron/services/ai/aiSplitConfigRepository.js`
- `app/electron/services/ai/aiRelayClient.js`
- `app/electron/services/products/productSplitService.js`

用途：商品标题、文案、图片生成/裂变。

后续建议：改成你自己的 OpenAI/兼容 API Key 配置，不要依赖未知第三方。

### 4.4 补发/快递单号接口

发现地址：

- `https://jk.dianxiaolong.net/api/getExpressNo`

相关文件：

- `app/electron/services/orders/reshipExpressNumberService.js`

用途：可能用于获取补发订单快递单号。

后续建议：确认这个接口是不是上个程序员或第三方服务。如果不可控，应替换成本地手动导入或你自己的服务。

## 5. 本地数据在哪里

程序使用 Electron 的 `app.getPath("userData")`，当前大概率是：

- `C:\Users\Admin\AppData\Roaming\wechat-shop-automation`

里面会保存：

```text
shops.json                         店铺索引
shop-groups.json                   店铺分组
syncConfig.json                    同步配置
shops/<shopId>/auth/cookies.json   店铺 Cookie
shops/<shopId>/auth/session.json   店铺 Session
shops/<shopId>/data/...            订单/商品/缓存/财务/任务数据
logs/                              诊断日志
```

## 6. 恢复难点

### 可以较好恢复

- Electron 主进程业务逻辑
- 微信小店接口调用逻辑
- 本地数据结构
- 订单/商品/店铺/财务/广告/AI 模块逻辑
- 启动、登录、Cookie 保存、IPC 调用链路

### 不能完美恢复

- 原始 `.vue` 单文件组件
- 原始 TypeScript 类型
- 原始变量名和注释
- 原始工程目录结构
- Git 提交历史
- 原程序员本地未打包进去的脚本/文档

原因：当前包里没有 sourcemap。

## 7. 建议重建路线

### 阶段 A：保运行，先别动核心逻辑

目标：确保软件能继续用。

1. 固定使用 `win-unpacked` 版本启动。
2. 保留本地授权服务或临时移除授权模块。
3. 备份 `C:\Users\Admin\AppData\Roaming\wechat-shop-automation`。
4. 备份 `E:\桌面\新建文件夹\recovered-source`。

### 阶段 B：重建开发环境

目标：让软件可以重新开发和打包。

需要安装/准备：

- Node.js LTS
- pnpm 或 npm
- VS Code
- electron
- electron-builder
- vite
- vue
- element-plus
- prettier
- eslint，可选

新工程建议：

```text
wechat-shop-automation-rebuild/
  package.json
  electron/
    main.js
    preload.js
    controllers/
    ipc/
    services/
  src/
    App.vue
    main.js
    router/
    views/
    components/
    api/
  shared/
  resources/
```

### 阶段 C：先迁移主进程

目标：先把最有价值、最接近原源码的 `electron/` 搬进新工程。

优先迁移：

1. `electron/services/shopPaths.js`
2. `electron/services/jsonFileStore.js`
3. `electron/services/shopStore.js`
4. `electron/services/sessionService.js`
5. `electron/services/shopApiClient.js`
6. `electron/services/shopBrowserManager.js`
7. `electron/ipc/`
8. `electron/controllers/`

### 阶段 D：重建前端页面

目标：把打包后的 Vue 页面拆回可维护页面。

优先级：

1. 店铺列表 ShopList
2. 数据概览 DataOverview
3. 订单管理 OrderManagement
4. 商品管理 ProductManagement
5. 云商品库 CloudProductLibrary
6. 发布任务 CloudPublishTasks
7. 财务 FinanceManagement
8. 广告 AdPromotionManagement
9. AI 裂变/素材中心

### 阶段 E：去掉旧授权码

目标：新版软件不再依赖 `apit.dajiaying.xyz` 和授权码页面。

做法：

- 删除或禁用 `appAuthManager`
- 删除启动时 `ensureServerReadyOrExit()`
- 主窗口直接加载主界面
- 如需你自己内部授权，再做新的、本地可控的授权机制

### 阶段 F：替换不可控外部服务

目标：避免再被别人服务器卡住。

需要替换：

1. `apit.dajiaying.xyz`：删除或自建授权
2. `ai.t8star.cn`：改成你自己的 AI API 配置
3. `jk.dianxiaolong.net`：确认归属，不可控就替换

## 8. 推荐当前下一步

建议下一步直接做：

1. 安装 Node.js 开发环境。
2. 新建 `wechat-shop-automation-rebuild` 工程。
3. 把 `recovered-source/app/electron` 迁移进去。
4. 改 main.js，先移除授权检查。
5. 做一个最小前端页面，能调用 IPC 并显示店铺列表。
6. 再逐步恢复页面。

这样最稳，不会一开始就陷入前端压缩代码里。
