@echo off
chcp 65001 >nul
set "PATH=E:\桌面\新建文件夹\tools\node-v20.19.5-win-x64;%PATH%"
cd /d "E:\桌面\新建文件夹\wechat-shop-automation-rebuild"
echo Node:
node -v
echo npm:
npm -v
echo.
echo 常用命令:
echo   node scripts/check-blocked-domains.js
echo   node scripts/start-local.js
echo.
cmd /k
