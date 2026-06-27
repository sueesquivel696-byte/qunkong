# ShopList 源码重建记录

## 本次目标

开始重建前端源码中的第一个页面：`ShopList` 店铺列表。

本次只新增可维护源码和独立构建入口，不覆盖当前正在使用的 `app/dist` 打包产物，不影响 `local-noauth-build` 运行版。

## 新增源码

| 路径 | 说明 |
|---|---|
| `index.renderer.html` | Vite 渲染端预览入口 |
| `vite.renderer.config.js` | 独立前端构建配置，输出到 `renderer-dist/` |
| `src/renderer/main.js` | Vue 应用入口 |
| `src/renderer/App.vue` | 前端重建壳页面 |
| `src/renderer/views/ShopList.vue` | 店铺列表页面源码 |
| `src/renderer/composables/useShopList.js` | 店铺列表数据加载、分组筛选、搜索逻辑 |
| `src/renderer/api/electronApi.js` | 对 `window.electronAPI` 的安全封装 |
| `src/renderer/components/ShopGroupBar.vue` | 店铺分组筛选条 |
| `src/renderer/components/ShopCard.vue` | 店铺卡片展示 |
| `src/renderer/components/ShopTable.vue` | 店铺表格展示 |
| `src/renderer/styles/base.css` | ShopList 页面基础样式 |

## 功能范围

已实现：

- 读取 `window.electronAPI.getShops()`。
- 读取 `window.electronAPI.getShopGroups()`。
- 监听 `onShopsUpdated` 和 `onShopGroupsUpdated`。
- 店铺分组筛选。
- 店铺名称 / ID 搜索。
- 卡片模式和列表模式。
- 店铺在线 / 离线状态展示。
- 店铺分组展示。
- 点击“进入店铺”调用 `openShopWindow`。

暂不启用：

- 添加店铺。
- 重新登录。
- 移除店铺。
- 分组新增 / 删除 / 批量分配。
- OpenAPI 凭据配置。
- 店铺评分、保证金、财务数据刷新。

这些操作涉及登录态、删除、本地数据或真实平台读取，后续必须先接入高风险操作保护层或更完整的页面逻辑。

## 构建方式

安装依赖后可执行：

```powershell
npm run build:renderer
```

构建输出目录：

```text
renderer-dist/
```

该目录仅用于预览验证，已加入 `.gitignore`，不会提交到 GitHub。

## 验证结果

本次已执行：

```powershell
npm install --ignore-scripts
npm run build:renderer
node scripts/check-blocked-domains.js
```

其中 `npm run build:renderer` 已成功，Vite 输出到 `renderer-dist/`。

## 已知限制

1. 当前新源码还没有替换运行版 `app/dist`。
2. UI 是第一版可维护源码，不追求完全还原旧打包页面视觉。
3. 高风险按钮默认禁用，后续接入保护层后再逐个开启。
4. `npm install` 报告依赖存在安全审计提示，暂未执行 `npm audit fix --force`，因为它可能引入破坏性升级。
