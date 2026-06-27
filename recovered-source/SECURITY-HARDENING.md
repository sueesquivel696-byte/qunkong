# 本地化与安全加固说明

## 目标

本软件以后只作为公司内部本地工具使用，不再依赖上个程序员注册的授权服务器，不再需要授权码登录，尽量避免未知外部服务影响软件启动和数据安全。

## 已完成的加固

### 1. 已制作本地无授权版

目录：

- `E:\桌面\新建文件夹\local-noauth-build`

启动脚本：

- `E:\桌面\新建文件夹\启动群控软件-本地无授权版.bat`

这个版本已修改：

- 不再启动 `appAuthManager` 去访问授权服务器
- `get-app-auth-status` 永远返回本地已授权
- 不需要授权码页面
- 不需要本地授权服务 `local-auth-server.ps1`

### 2. 已禁用旧授权服务器

旧服务器：

- `https://apit.dajiaying.xyz`

处理方式：

- `local-noauth-build/resources/app/electron/main.js` 不再调用授权检查
- `local-noauth-build/resources/app/electron/services/appAuthConfig.js` 默认地址已替换为 `http://local.invalid/blocked-auth`

### 3. 已禁用未知 AI 默认服务

旧默认地址：

- `https://ai.t8star.cn/v1`

处理方式：

- 默认地址替换为 `http://local.invalid/blocked-ai`

后续如果需要 AI 功能，请改成公司自己控制的 API Key/中转服务。

### 4. 已禁用未知快递/补发接口

旧地址：

- `https://jk.dianxiaolong.net/api/getExpressNo`

处理方式：

- 默认地址替换为 `http://local.invalid/blocked-express-no`

如果这个功能还需要使用，建议改成公司自己的接口或手动导入。

### 5. 软件内部增加了浏览器侧域名拦截

在 `local-noauth-build/resources/app/electron/main.js` 中增加：

- `apit.dajiaying.xyz`
- `ai.t8star.cn`
- `jk.dianxiaolong.net`

这三个域名会在 Electron 浏览器请求层被取消。

注意：Node 主进程内的请求需要通过替换代码里的默认 URL 来禁用，已做。

## 不应该阻断的域名

下面是微信官方业务接口，不应拦截，否则软件无法获取店铺、订单、商品、财务等数据：

- `store.weixin.qq.com`
- `shop-promotion.qq.com`
- `api.weixin.qq.com`
- `res.wx.qq.com`

## 还建议你手动做的安全动作

### 1. 修改所有微信小店/微信账号密码

如果上个程序员知道账号密码，请立即修改：

- 微信号密码
- 微信小店后台相关管理员权限
- 企业微信/管理员账号
- 支付/商户平台管理员权限

### 2. 清理微信小店后台管理员/运营者

进入微信小店后台，检查：

- 管理员
- 运营者
- 子账号
- API 权限
- 授权应用

删除不认识的人和上个程序员账号。

### 3. 轮换 OpenAPI 凭证

本软件本地保存了部分店铺的 `open-api-credential.json`。

路径类似：

- `C:\Users\Admin\AppData\Roaming\wechat-shop-automation\shops\<shopId>\auth\open-api-credential.json`

如果上个程序员可能知道 AppSecret，建议到微信后台重新生成/轮换。

### 4. 备份本地数据

已完成一次备份：

- `E:\桌面\新建文件夹\wechat-shop-automation-userData-backup-20260627-002340.zip`

建议每天/每周备份：

- `C:\Users\Admin\AppData\Roaming\wechat-shop-automation`

### 5. 系统级 hosts 拦截

由于写 hosts 需要管理员权限，我已生成脚本：

- `E:\桌面\新建文件夹\以管理员运行-阻断旧外部服务器.ps1`

如果需要系统级拦截，请右键 PowerShell 以管理员身份运行该脚本。

它只阻断：

- `apit.dajiaying.xyz`
- `ai.t8star.cn`
- `jk.dianxiaolong.net`

不会阻断微信官方域名。

## 判断上个程序员是否还能控制软件

如果继续使用旧外层程序：

- `D:\5.13最新群控\WechatShopAutomation_1.0.0.exe`

仍然可能受到旧授权逻辑影响。

以后请改用：

- `E:\桌面\新建文件夹\启动群控软件-本地无授权版.bat`

本地无授权版已经去掉旧授权入口，并屏蔽已发现的非微信官方外部服务。

## 后续重建建议

短期：使用 `local-noauth-build` 保持业务运行。

中期：继续搭建新工程，把 `recovered-source/app/electron` 迁移进去，重新写前端页面。

长期：形成公司自己的代码仓库、打包流程、备份流程和权限管理制度。

## 本机远程控制风险检查结果

快速检查发现当前电脑存在远程控制/远程协助相关自启动项：

### 正在运行

- `D:\向日葵\AweSun\flutter\AweSun.exe`，进程名 `AweSun.exe`

### 开机自启动

当前用户自启动：

- `GameViewer`：`D:\uu远程\GameViewer\GameViewer.exe --auto-run`

本机全局自启动：

- `AweSun`：`D:\向日葵\AweSun\AweSun.exe --cmd=autorun`

## 重要建议

如果这些远程软件不是公司自己掌控账号，请立即处理：

1. 登录向日葵/UU远程，确认绑定账号是不是公司账号。
2. 如果是上个程序员账号，马上解绑或卸载。
3. 修改远程控制软件登录密码。
4. 关闭无人值守访问、固定验证码、开机自启。
5. 删除不认识的远程设备授权。

注意：我暂时没有自动停止/卸载这些远控软件，避免你当前如果正在远程连接电脑，会被断开。确认不需要后再处理。

## 2026-06-27 追加加固记录

用户确认：向日葵、UU远程为公司/本人自用远程软件，因此本次不禁用、不卸载远程软件。

本次继续完成：

1. 已创建可直接双击入口：
   - `E:\桌面\微信小店群控-本地无授权版.lnk`
   - `E:\桌面\新建文件夹\微信小店群控-本地无授权版.lnk`
2. 已将 AI 服务实现改为禁用，不再访问 `ai.t8star.cn`。
3. 已将快递补发提号服务实现改为禁用，不再访问 `jk.dianxiaolong.net`。
4. 已确认本地无授权版不需要 `local-auth-server.ps1`，端口 `32983` 未监听。
5. 已下载便携 Node.js 到 `E:\桌面\新建文件夹\tools\node-v20.19.5-win-x64`，供后续开发使用。
6. 已新增项目安全检查脚本：`wechat-shop-automation-rebuild\scripts\check-blocked-domains.js`。

验证结果：

- `local-noauth-build/resources/app/electron` 中不存在以下 live URL：
  - `https://apit.dajiaying.xyz`
  - `https://ai.t8star.cn`
  - `https://jk.dianxiaolong.net`

说明：这些域名可能仍出现在 blocklist 或错误提示中，这是为了拦截和说明用途，不代表会访问它们。

## 2026-06-27 双击启动最终验证

已通过桌面快捷方式模拟双击：

- `E:\桌面\微信小店群控-本地无授权版.lnk`

验证结果：

- 成功启动进程：`E:\桌面\新建文件夹\local-noauth-build\微信小店多店铺群控.exe`
- 主窗口标题：`微信小店多店铺自动化群控`
- 本地授权服务端口 `32983` 未监听
- 旧第三方 live URL 扫描命中数：0

修复记录：

- 曾因 `main.js` 中错误字面量 `` `r`n `` 导致窗口显示 `Error`，已修复并通过双击验证。

## 2026-06-27 白屏复核与截图验证

用户指出此前“能打开”的验证不充分，实际为白屏。本次重新验证并修复：

- 捕获到前端错误：`Uncaught SyntaxError: Unexpected identifier '_'`。
- 原因：前端压缩包被不安全文本替换破坏。
- 修复：从原始解包文件恢复前端入口 JS，再用 Node UTF-8 安全替换旧第三方 AI 地址。
- 验证：页面实际渲染，`appHtmlLength=114894`。
- 截图证据：`E:\桌面\新建文件夹\wechat-shop-automation-rebuild\reports\double-click-visual-verification-20260627.png`。

当前结论：桌面快捷方式可直接打开，并显示店铺看板，不是白屏。
