@echo off
REM Charis Dashboard - GitHub Push Script (Windows)
REM This script helps you push the dashboard to GitHub

echo.
echo ========================================
echo Charis Foundation Dashboard - GitHub Push
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed
    echo Please install Git from: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist .git (
    echo Error: Not a git repository
    echo Please run this script from the dashboard-app directory
    pause
    exit /b 1
)

echo Checking remote repository...
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Setting up remote: https://github.com/nate-peregoy/Charis-Dashboard.git
    git remote add origin https://github.com/nate-peregoy/Charis-Dashboard.git
) else (
    echo Remote configured successfully
)

echo.
echo Current status:
git status --short

echo.
echo Commit history:
git log --oneline -5

echo.
echo ========================================
echo Choose your authentication method:
echo ========================================
echo 1. GitHub Personal Access Token (recommended)
echo 2. SSH Key
echo 3. Cancel
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Using Personal Access Token:
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Generate new token (classic^)
    echo 3. Select 'repo' scope
    echo 4. Use the token as your password when prompted
    echo.
    pause
    git push -u origin main
    goto :check_result
)

if "%choice%"=="2" (
    echo.
    echo Using SSH Key...
    git remote set-url origin git@github.com:nate-peregoy/Charis-Dashboard.git
    git push -u origin main
    goto :check_result
)

if "%choice%"=="3" (
    echo.
    echo Push cancelled
    pause
    exit /b 0
)

echo.
echo Invalid choice
pause
exit /b 1

:check_result
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Successfully pushed to GitHub!
    echo ========================================
    echo.
    echo View your repository:
    echo https://github.com/nate-peregoy/Charis-Dashboard
    echo.
    echo Your Charis Foundation Dashboard is now on GitHub!
) else (
    echo.
    echo ========================================
    echo Push failed
    echo ========================================
    echo.
    echo Common issues:
    echo - Incorrect credentials
    echo - No write access to repository
    echo - Repository doesn't exist
    echo.
    echo See GITHUB_PUSH_INSTRUCTIONS.md for detailed help
)

echo.
pause
