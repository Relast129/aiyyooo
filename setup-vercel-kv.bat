@echo off
echo ================================================================================
echo                    VERCEL KV DATABASE SETUP WIZARD
echo ================================================================================
echo.
echo This script will help you set up Vercel KV database for persistent storage.
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI is not installed!
    echo.
    echo Installing Vercel CLI...
    npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo [INFO] Vercel CLI detected!
echo.

echo ================================================================================
echo STEP 1: Login to Vercel
echo ================================================================================
echo.
echo This will open your browser to login...
echo.
pause

vercel login
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Login failed
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Logged in to Vercel!
echo.

echo ================================================================================
echo STEP 2: Deploy Project to Vercel
echo ================================================================================
echo.
echo Deploying your project...
echo.

vercel
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Project deployed!
echo.

echo ================================================================================
echo STEP 3: Create KV Database (Manual Step)
echo ================================================================================
echo.
echo Now you need to create the KV database in Vercel Dashboard:
echo.
echo 1. Opening Vercel Dashboard in your browser...
echo.
start https://vercel.com/dashboard
echo.
echo 2. Follow these steps in the browser:
echo    - Click on your project (aiyyooo or ceyora-holidays)
echo    - Click "Storage" tab
echo    - Click "Create Database"
echo    - Select "KV" (Key-Value Store)
echo    - Name it: ceyora-kv
echo    - Click "Create"
echo    - Click "Connect to Project"
echo    - Select your project
echo    - Click "Connect"
echo.
echo 3. Press any key here AFTER you've completed the above steps...
echo.
pause

echo.
echo ================================================================================
echo STEP 4: Redeploy to Production
echo ================================================================================
echo.
echo Redeploying to activate the KV database connection...
echo.

vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Production deployment failed
    pause
    exit /b 1
)

echo.
echo ================================================================================
echo [SUCCESS] SETUP COMPLETE!
echo ================================================================================
echo.
echo Your Vercel KV database is now connected!
echo.
echo Next steps:
echo 1. Go to your website admin panel
echo 2. Try uploading an image
echo 3. Refresh the page - image should persist!
echo.
echo Admin URL: Check your Vercel dashboard for the deployment URL
echo Add /admin-login.html to access admin panel
echo.
echo Login credentials:
echo Username: admin
echo Password: admin@ceyora
echo.
pause
