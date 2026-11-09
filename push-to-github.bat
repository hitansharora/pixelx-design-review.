@echo off
title Push PixelX Design Review to GitHub
cd /d "%~dp0"
echo ========================================================
echo   Pushing PixelX Design Review to GitHub...
echo   Repository: https://github.com/hitansharora/pixelx-design-review.
echo ========================================================
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main --force
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo [SUCCESS] Changes successfully pushed to GitHub!
    echo Your live GitHub Pages site will update shortly at:
    echo https://hitansharora.github.io/pixelx-design-review./
    echo ========================================================
) else (
    echo ========================================================
    echo [INFO] If prompted for authentication, please complete 
    echo the GitHub login in the browser or terminal window.
    echo ========================================================
)
echo.
pause
