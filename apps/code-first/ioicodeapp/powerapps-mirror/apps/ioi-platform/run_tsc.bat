@echo off
cd /d "c:\Users\aliak\OneDrive\Documents\IOI HCL Migration Projects\powerapps-mirror\apps\ioi-platform"
npx tsc -p tsconfig.app.json --noEmit > "%TEMP%\tsc_output.txt" 2>&1
echo Exit code: %ERRORLEVEL% >> "%TEMP%\tsc_output.txt"
exit /b 0
