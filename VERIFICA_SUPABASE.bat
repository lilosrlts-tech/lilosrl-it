@echo off
chcp 65001 >nul
title LILO — Verifica chiavi Supabase

cd /d "%~dp0web"

powershell -NoProfile -Command ^
  "$envFile='.env.local'; if (-not (Test-Path $envFile)) { Write-Host 'ERRORE: web/.env.local mancante'; exit 1 }; ^
   $vars=@{}; Get-Content $envFile | ForEach-Object { if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }; $i=$_.IndexOf('='); if ($i -lt 1) { return }; $vars[$_.Substring(0,$i).Trim()]=$_.Substring($i+1).Trim() }; ^
   $u=$vars['NEXT_PUBLIC_SUPABASE_URL']; $k=$vars['NEXT_PUBLIC_SUPABASE_ANON_KEY']; ^
   if ($k -match 'INCOLLA|Example|sb_publishable') { Write-Host 'ERRORE: chiave anon non valida (placeholder)'; exit 1 }; ^
   $body = @{ apikey = $k; Authorization = \"Bearer $k\" } | ConvertTo-Json; ^
   try { $r = Invoke-RestMethod -Uri \"$u/rest/v1/impostazioni_sito?select=id&limit=1\" -Headers @{ apikey = $k; Authorization = \"Bearer $k\" } -Method Get; Write-Host 'OK: Supabase collegato — impostazioni_sito raggiungibile.' } catch { Write-Host ('FALLITO: ' + $_.Exception.Message); exit 1 }"

if errorlevel 1 (
  echo.
  echo  Usa chiavi Legacy complete (eyJhbGci...) in supabase/CREDENZIALI.env
  echo  poi APPLICA_CHIAVI_SUPABASE.bat
  echo.
)

pause
