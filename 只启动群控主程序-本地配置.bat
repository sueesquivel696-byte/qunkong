@echo off
chcp 65001 >nul
set APP_AUTH_SERVER_URL=http://localhost:32983
set APP_AUTH_LICENSE_KEY=qiu3298325
set APP_AUTH_AUTO_LOGIN=1
set APP_AUTH_REQUEST_TIMEOUT_MS=8000
cd /d "D:\5.13最新群控\win-unpacked"
start "WechatShopAutomation" "D:\5.13最新群控\win-unpacked\微信小店多店铺群控.exe"

