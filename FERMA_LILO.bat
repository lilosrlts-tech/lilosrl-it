@echo off
chcp 65001 >nul
echo.
echo  Chiusura server LILO (porte 3000, 3001, 3002)...
powershell -NoProfile -Command "foreach ($p in 3000,3001,3002) { Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"
timeout /t 3 /nobreak >nul
echo  Pulizia cache (risolve errori Internal Server Error)...
if exist "%~dp0web\.next" rmdir /s /q "%~dp0web\.next"
if exist "%~dp0admin\.next" rmdir /s /q "%~dp0admin\.next"
echo.
echo  Fatto. Chiudi anche le finestre nere "LILO Sito Pubblico" e "LILO Admin" se aperte.
echo  Poi esegui AVVIA_LILO.bat per riavviare.
echo.
timeout /t 4
