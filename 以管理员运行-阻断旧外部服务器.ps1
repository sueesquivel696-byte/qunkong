# 右键 PowerShell 以管理员运行本脚本。
# 作用：系统级阻断旧授权服务器和未知第三方服务。
# 不会阻断微信官方域名 store.weixin.qq.com / shop-promotion.qq.com / api.weixin.qq.com。

$hosts = "$env:SystemRoot\System32\drivers\etc\hosts"
$backup = "E:\桌面\新建文件夹\hosts-backup-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + ".txt"
Copy-Item -LiteralPath $hosts -Destination $backup -Force
$content = Get-Content -LiteralPath $hosts -Raw
$block = @"

# BEGIN wechat-shop-automation local safety block
# Block old programmer/unknown external service dependencies. Do NOT block WeChat official domains.
0.0.0.0 apit.dajiaying.xyz
0.0.0.0 ai.t8star.cn
0.0.0.0 jk.dianxiaolong.net
# END wechat-shop-automation local safety block
"@
if ($content -notmatch 'BEGIN wechat-shop-automation local safety block') {
  Add-Content -LiteralPath $hosts -Value $block -Encoding ASCII
  Write-Host "已写入 hosts 拦截。备份：$backup"
} else {
  Write-Host "hosts 拦截已存在。备份：$backup"
}
ipconfig /flushdns
pause
