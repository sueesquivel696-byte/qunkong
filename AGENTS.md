# AGENTS.md

## 项目目标

本项目用于恢复和重建公司内部使用的微信小店多店铺群控软件。

核心原则：

1. 本地自用，不依赖离职程序员的授权服务器。
2. 默认不需要授权码、不需要登录第三方授权系统。
3. 微信官方业务接口可以保留；非公司可控的第三方接口必须禁用或替换。
4. 所有关键修改必须记录到 README / PROJECT_SPEC / CHANGELOG / SECURITY-HARDENING 文档。
5. 修改前优先读取项目文档，不凭记忆改。
6. 旧数据目录必须保护，不能随意删除：`C:\Users\Admin\AppData\Roaming\wechat-shop-automation`。
7. 当前恢复源码没有 sourcemap，前端 Vue 原始源码需要逐步重写，不可假装已经完整恢复。

## 已知禁止依赖

以下域名属于离职程序员或未知第三方控制，默认禁止：

- `apit.dajiaying.xyz`
- `ai.t8star.cn`
- `jk.dianxiaolong.net`

## 允许依赖

以下为微信官方业务接口，软件正常功能需要联网访问：

- `store.weixin.qq.com`
- `shop-promotion.qq.com`
- `api.weixin.qq.com`
- `res.wx.qq.com`

## 运行入口

优先使用本地无授权版：

- `E:\桌面\新建文件夹\local-noauth-build\微信小店多店铺群控.exe`

或使用快捷方式：

- `E:\桌面\新建文件夹\微信小店群控-本地无授权版.lnk`
