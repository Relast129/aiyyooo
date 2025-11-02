@echo off
echo ================================================================================
echo                    CEYORA HOLIDAYS - DEPLOYMENT SCRIPT
echo ================================================================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI is not installed!
    echo.
    echo Please install it first by running:
    echo npm install -g vercel
    echo.
    pause
    exit /b 1
)

echo [INFO] Vercel CLI detected!
echo.

REM Ask user what they want to do
echo What would you like to do?
echo.
echo 1. First time deployment (vercel)
echo 2. Production deployment (vercel --prod)
echo 3. Check deployment status (vercel ls)
echo 4. View logs (vercel logs)
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo [INFO] Starting first-time deployment...
    echo [INFO] You will be asked to login and configure your project
    echo.
    vercel
    echo.
    echo ================================================================================
    echo [SUCCESS] Initial deployment complete!
    echo.
    echo NEXT STEPS:
    echo 1. Go to https://vercel.com/dashboard
    echo 2. Select your project
    echo 3. Go to Storage tab
    echo 4. Create a KV database named 'ceyora-kv'
    echo 5. Run this script again and choose option 2
    echo ================================================================================
    pause
) else if "%choice%"=="2" (
    echo.
    echo [INFO] Deploying to production...
    echo.
    vercel --prod
    echo.
    echo ================================================================================
    echo [SUCCESS] Production deployment complete!
    echo.
    echo Your website is now live!
    echo Check your Vercel dashboard for the URL.
    echo ================================================================================
    pause
) else if "%choice%"=="3" (
    echo.
    echo [INFO] Checking deployment status...
    echo.
    vercel ls
    echo.
    pause
) else if "%choice%"=="4" (
    echo.
    echo [INFO] Fetching logs...
    echo.
    vercel logs
    echo.
    pause
) else if "%choice%"=="5" (
    echo.
    echo Goodbye!
    exit /b 0
) else (
    echo.
    echo [ERROR] Invalid choice!
    pause
    exit /b 1
)
