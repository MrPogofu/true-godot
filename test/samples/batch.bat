@echo off
REM Package the extension
setlocal enabledelayedexpansion
set VERSION=0.5.0
if "%1"=="" (
    echo No version given, using %VERSION%
) else (
    set VERSION=%1
)
for %%f in (themes\*.json) do echo Found %%f
call npx @vscode/vsce package
goto :eof
