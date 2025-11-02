@echo off
echo ================================================================================
echo                    PUSH TO GITHUB - AUTOMATED SCRIPT
echo ================================================================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [INFO] Git detected!
echo.

REM Check if already initialized
if exist ".git" (
    echo [INFO] Git repository already initialized
    echo.
    goto :push
)

REM Initialize new repository
echo [INFO] Initializing new Git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to initialize Git repository
    pause
    exit /b 1
)
echo [SUCCESS] Git repository initialized
echo.

:add_files
echo [INFO] Adding all files to Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [SUCCESS] Files added
echo.

:commit
echo [INFO] Creating initial commit...
git commit -m "Complete Ceyora Holidays website with admin dashboard and persistent storage"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create commit
    pause
    exit /b 1
)
echo [SUCCESS] Commit created
echo.

:set_branch
echo [INFO] Setting main branch...
git branch -M main
echo [SUCCESS] Branch set to main
echo.

:remote
echo ================================================================================
echo GITHUB REPOSITORY SETUP
echo ================================================================================
echo.
echo Please enter your GitHub repository URL
echo Example: https://github.com/username/ceyora-holidays.git
echo.
set /p repo_url="Enter repository URL: "

if "%repo_url%"=="" (
    echo [ERROR] Repository URL cannot be empty!
    pause
    exit /b 1
)

echo.
echo [INFO] Adding remote repository...
git remote add origin %repo_url%
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Remote might already exist, removing and re-adding...
    git remote remove origin
    git remote add origin %repo_url%
)
echo [SUCCESS] Remote repository added
echo.

:push
echo [INFO] Pushing to GitHub...
echo.
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] Push failed. Trying force push...
    echo.
    git push -u origin main -f
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to push to GitHub
        echo.
        echo Common issues:
        echo 1. Authentication failed - Use Personal Access Token
        echo 2. Repository doesn't exist - Create it on GitHub first
        echo 3. Wrong repository URL - Check the URL
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ================================================================================
echo [SUCCESS] Code successfully pushed to GitHub!
echo ================================================================================
echo.
echo Next steps:
echo 1. Go to your GitHub repository to verify files
echo 2. Connect repository to Vercel for automatic deployments
echo 3. Go to: https://vercel.com/new
echo 4. Import your GitHub repository
echo.
pause
