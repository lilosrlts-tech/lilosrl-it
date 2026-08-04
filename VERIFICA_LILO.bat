@echo off
chcp 65001 >nul
title Verifica LILO
echo.
echo  === VERIFICA SERVER LILO ===
echo.
powershell -NoProfile -Command ^
  "$urls = @('http://localhost:3000/','http://localhost:3000/contatti','http://localhost:3001/admin/login');" ^
  "foreach ($u in $urls) { try { $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 15; Write-Host ('OK  ' + $u + ' -> ' + $r.StatusCode) -ForegroundColor Green } catch { Write-Host ('ERR ' + $u + ' -> ' + $_.Exception.Message) -ForegroundColor Red } }"
echo.
pause
