@echo off

chcp 65001 >nul

title LILO Autonoleggio — Avvio

cd /d "%~dp0"



echo.

echo  ============================================

echo   AVVIO LILO — attendere 30-40 secondi...

echo  ============================================

echo.



REM 1) Chiude TUTTI i server sulle porte e attende che i processi terminino

echo [1/6] Chiusura server precedenti...

powershell -NoProfile -Command "foreach ($p in 3000,3001,3002) { Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"

timeout /t 3 /nobreak >nul



REM 2) Pulisce cache (evita Internal Server Error / Cannot find module)

echo [2/6] Pulizia cache Next.js...

if exist "%~dp0web\.next" rmdir /s /q "%~dp0web\.next"

if exist "%~dp0admin\.next" rmdir /s /q "%~dp0admin\.next"

timeout /t 2 /nobreak >nul



REM 3) Avvia sito pubblico (porta 3000)

echo [3/6] Avvio sito pubblico (porta 3000)...

start "LILO Sito Pubblico" cmd /k "cd /d "%~dp0web" && set NEXT_PRIVATE_DISABLE_DEVTOOLS=1&& npm run dev"

timeout /t 6 /nobreak >nul



REM 4) Avvia admin (porta 3001)

echo [4/6] Avvio pannello admin (porta 3001)...

start "LILO Admin" cmd /k "cd /d "%~dp0admin" && set NEXT_PRIVATE_DISABLE_DEVTOOLS=1&& npm run dev -- -p 3001"

timeout /t 8 /nobreak >nul



REM 5) Attende che sito E admin rispondano (max 90 sec)

echo [5/6] Attendo che i server siano pronti...

powershell -NoProfile -Command ^

  "$okWeb = $false; $okAdmin = $false; for ($i=0; $i -lt 45; $i++) { if (-not $okWeb) { try { $r = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 4; if ($r.StatusCode -eq 200) { $okWeb = $true } } catch {} }; if (-not $okAdmin) { try { $r = Invoke-WebRequest -Uri 'http://localhost:3001/admin/login' -UseBasicParsing -TimeoutSec 4; if ($r.StatusCode -eq 200) { $okAdmin = $true } } catch {} }; if ($okWeb -and $okAdmin) { break }; Start-Sleep -Seconds 2 }; if (-not $okWeb) { Write-Host 'ATTENZIONE: sito pubblico non risponde. Controlla finestra LILO Sito Pubblico.' -ForegroundColor Yellow }; if (-not $okAdmin) { Write-Host 'ATTENZIONE: admin non risponde. Esegui FERMA_LILO.bat e riprova.' -ForegroundColor Yellow }; if ($okWeb -and $okAdmin) { Write-Host 'Tutto pronto!' -ForegroundColor Green }"



echo.

echo  ============================================

echo   LINK DA APRIRE NEL BROWSER:

echo  ============================================

echo   Sito:         http://localhost:3000

echo   Admin login:  http://localhost:3001/admin/login

echo   Password:     lilo2024

echo  ============================================

echo.

echo  Se vedi "Internal Server Error": esegui FERMA_LILO.bat poi AVVIA_LILO.bat

echo.

start http://localhost:3000

echo.

pause

