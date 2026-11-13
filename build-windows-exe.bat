@echo off
echo ===================================================
echo   Building "Starlight Atlas" for Windows (.exe)
echo ===================================================
echo.
call npm install
if errorlevel 1 goto :error

call npm run build:win
if errorlevel 1 goto :error

echo.
echo Done! Check the "release" folder for:
echo   - Starlight-Atlas-Portable.exe  (Direct shareable single .exe!)
echo   - Starlight-Atlas-Setup.exe     (Windows Installer)
echo.
pause
exit /b 0

:error
echo.
echo Build failed. Make sure Node.js 18+ is installed on Windows.
pause
exit /b 1
