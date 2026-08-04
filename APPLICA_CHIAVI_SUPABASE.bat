@echo off
chcp 65001 >nul
title LILO — Applica chiavi Supabase

cd /d "%~dp0"

if not exist "%~dp0supabase\CREDENZIALI.env" (
  echo.
  echo  File mancante: supabase\CREDENZIALI.env
  echo  Incolla le chiavi Legacy complete eyJhbGci... nel file.
  echo.
  pause
  exit /b 1
)

powershell -NoProfile -Command ^
  "$vars=@{}; Get-Content '%~dp0supabase\CREDENZIALI.env' | ForEach-Object { if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }; $i=$_.IndexOf('='); if ($i -lt 1) { return }; $k=$_.Substring(0,$i).Trim(); $v=$_.Substring($i+1).Trim(); $vars[$k]=$v }; ^
   if (-not $vars['NEXT_PUBLIC_SUPABASE_URL'] -or -not $vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] -or -not $vars['SUPABASE_SERVICE_ROLE_KEY']) { Write-Host 'ERRORE: chiavi mancanti in CREDENZIALI.env'; exit 1 }; ^
   if ($vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] -match 'INCOLLA|Example|sb_publishable') { Write-Host 'ERRORE: anon key ancora placeholder — copia la chiave COMPLETA dal dashboard'; exit 1 }; ^
   if ($vars['SUPABASE_SERVICE_ROLE_KEY'] -match 'INCOLLA|Example|sb_secret') { Write-Host 'ERRORE: service_role ancora placeholder — copia la chiave COMPLETA dal dashboard'; exit 1 }; ^
   @('# Supabase — sito pubblico', \"NEXT_PUBLIC_SUPABASE_URL=$($vars['NEXT_PUBLIC_SUPABASE_URL'])\", \"NEXT_PUBLIC_SUPABASE_ANON_KEY=$($vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'])\", 'NEXT_PUBLIC_DEMO_MODE=false', '') | Set-Content '%~dp0web\.env.local' -Encoding UTF8; ^
   @('ADMIN_PASSWORD=lilo2024', 'ADMIN_SESSION_SECRET=lilo-dev-session-secret-32chars-min', '', \"NEXT_PUBLIC_SUPABASE_URL=$($vars['NEXT_PUBLIC_SUPABASE_URL'])\", \"NEXT_PUBLIC_SUPABASE_ANON_KEY=$($vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'])\", \"SUPABASE_SERVICE_ROLE_KEY=$($vars['SUPABASE_SERVICE_ROLE_KEY'])\", '') | Set-Content '%~dp0admin\.env.local' -Encoding UTF8; ^
   Write-Host 'OK: web/.env.local e admin/.env.local aggiornati.'"

if errorlevel 1 (
  echo.
  pause
  exit /b 1
)

echo.
echo  Esegui RIAVVIA_LILO.bat poi VERIFICA_SUPABASE.bat
echo.
pause
