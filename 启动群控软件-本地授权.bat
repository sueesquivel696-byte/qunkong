@echo off
chcp 65001 >nul
set APP_AUTH_SERVER_URL=http://localhost:32983
set APP_AUTH_LICENSE_KEY=qiu3298325
set APP_AUTH_AUTO_LOGIN=1
set APP_AUTH_REQUEST_TIMEOUT_MS=8000
start "local auth" powershell -NoProfile -ExecutionPolicy Bypass -File "E:\桌面\新建文件夹\local-auth-server.ps1" -Port 32983 -LicenseKey "qiu3298325"
timeout /t 1 /nobreak >nul
cd /d "D:\5.13最新群控\win-unpacked"
start "WechatShopAutomation" "D:\5.13最新群控\win-unpacked\微信小店多店铺群控.exe"

