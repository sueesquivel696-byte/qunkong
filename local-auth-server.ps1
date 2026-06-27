param(
  [int]$Port = 32983,
  [string]$LicenseKey = "qiu3298325"
)

$prefix = "http://localhost:$Port/"
$LogFile = Join-Path (Split-Path -Parent $PSCommandPath) 'local-auth-server.log'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

function Write-Log($msg) {
  Add-Content -LiteralPath $LogFile -Encoding UTF8 -Value ("{0} {1}" -f (Get-Date -Format s), $msg)
}

function Send-Json($ctx, [int]$status, $obj) {
  $json = $obj | ConvertTo-Json -Depth 20 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $ctx.Response.StatusCode = $status
  $ctx.Response.ContentType = 'application/json; charset=utf-8'
  $ctx.Response.ContentLength64 = $bytes.Length
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.OutputStream.Close()
}

function Read-JsonBody($request) {
  try {
    $reader = [System.IO.StreamReader]::new($request.InputStream, $request.ContentEncoding)
    $text = $reader.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($text)) { return @{} }
    return $text | ConvertFrom-Json
  } catch {
    Write-Log ("JSON_PARSE_ERROR " + $_.Exception.Message)
    return @{}
  }
}

try {
  $listener.Start()
  Write-Log "START prefix=$prefix license=$LicenseKey"
  Write-Host "Local auth server listening: $prefix"
  Write-Host "License key: $LicenseKey"
  Write-Host "Press Ctrl+C to stop."

  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.AbsolutePath
    $method = $ctx.Request.HttpMethod.ToUpperInvariant()
    Write-Log "REQ $method $path"

    try {
      if ($method -eq 'GET' -and $path -eq '/api/bootstrap') {
        Send-Json $ctx 200 @{
          ok = $true
          data = @{
            serverTime = [DateTimeOffset]::UtcNow.ToString('o')
            minVersion = '1.0.0'
            latestVersion = '1.0.0'
          }
        }
        continue
      }

      if ($method -eq 'POST' -and $path -eq '/api/login') {
        $body = Read-JsonBody $ctx.Request
        $key = ([string]($body.licenseKey)).Trim()
        $device = ([string]($body.deviceId)).Trim()
        Write-Log "LOGIN licenseKey=[$key] expected=[$LicenseKey] deviceId=[$device]"
        if ($key -ne $LicenseKey) {
          Send-Json $ctx 403 @{
            ok = $false
            error = @{ code='INVALID_LICENSE'; message='授权码无效，请核对后重试'; details=@{ receivedLength = $key.Length } }
          }
          continue
        }
        $tokenRaw = "$key|$device|$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
        $token = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($tokenRaw))
        Send-Json $ctx 200 @{
          ok = $true
          data = @{
            sessionToken = $token
            token = $token
            expiresAt = [DateTimeOffset]::UtcNow.AddYears(10).ToString('o')
            license = @{
              key = $key
              status = 'active'
              deviceLimit = 999
            }
          }
        }
        continue
      }

      if ($method -eq 'POST' -and $path -eq '/api/heartbeat') {
        Send-Json $ctx 200 @{
          ok = $true
          data = @{
            valid = $true
            serverTime = [DateTimeOffset]::UtcNow.ToString('o')
          }
        }
        continue
      }

      Send-Json $ctx 404 @{ ok=$false; error=@{ code='NOT_FOUND'; message="No route: $method $path"; details=@{} } }
    } catch {
      Write-Log ("ERROR " + $_.Exception.Message)
      Send-Json $ctx 500 @{ ok=$false; error=@{ code='SERVER_ERROR'; message=$_.Exception.Message; details=@{} } }
    }
  }
} finally {
  Write-Log "STOP"
  if ($listener.IsListening) { $listener.Stop() }
  $listener.Close()
}
