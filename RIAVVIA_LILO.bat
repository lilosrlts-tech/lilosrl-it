@echo off
chcp 65001 >nul
title LILO — Riavvio completo
cd /d "%~dp0"
echo.
echo  Riavvio completo LILO (ferma + pulisce cache + riavvia)...
echo.
call "%~dp0FERMA_LILO.bat"
call "%~dp0AVVIA_LILO.bat"
