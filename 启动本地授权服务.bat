@echo off
chcp 65001 >nul
title 微信小店群控-本地授权服务
powershell -NoProfile -ExecutionPolicy Bypass -File "E:\桌面\新建文件夹\local-auth-server.ps1" -Port 32983 -LicenseKey "qiu3298325"
pause
