@echo off
echo ========================================
echo    Maiko EDU - Matomo Setup Script
echo ========================================
echo.

echo Step 1: Checking if XAMPP is installed...
if exist "C:\xampp\xampp-control.exe" (
    echo ✅ XAMPP found at C:\xampp
    set XAMPP_PATH=C:\xampp
) else if exist "C:\wamp64\wampmanager.exe" (
    echo ✅ WAMP found at C:\wamp64
    set XAMPP_PATH=C:\wamp64
) else (
    echo ❌ Neither XAMPP nor WAMP found
    echo Please install XAMPP from https://www.apachefriends.org/download.html
    echo or WAMP from https://www.wampserver.com/
    pause
    exit /b 1
)

echo.
echo Step 2: Checking Matomo installation...
if exist "%XAMPP_PATH%\htdocs\matomo\index.php" (
    echo ✅ Matomo already installed
) else (
    echo ❌ Matomo not found in web server directory
    echo Please extract matomo-latest.zip to %XAMPP_PATH%\htdocs\matomo
    echo.
    echo Instructions:
    echo 1. Extract the zip file to %XAMPP_PATH%\htdocs\matomo
    echo 2. Make sure all files are in the matomo folder
    echo 3. Run this script again
    pause
    exit /b 1
)

echo.
echo Step 3: Starting web server...
if exist "C:\xampp\xampp-control.exe" (
    start "" "C:\xampp\xampp-control.exe"
    echo ✅ XAMPP Control Panel opened
    echo Please start Apache and MySQL services
) else if exist "C:\wamp64\wampmanager.exe" (
    start "" "C:\wamp64\wampmanager.exe"
    echo ✅ WAMP Manager opened
    echo Please start all services
)

echo.
echo Step 4: Opening Matomo installation...
timeout /t 5 /nobreak > nul
start "" "http://localhost/matomo"

echo.
echo ========================================
echo    Matomo Setup Instructions
echo ========================================
echo.
echo 1. Complete the Matomo installation wizard
echo 2. Create a database called 'matomo'
echo 3. Create an admin user account
echo 4. Create your first site (e.g., "Maiko EDU")
echo 5. Get your Site ID and Auth Token
echo 6. Update your .env file with the credentials
echo.
echo Database settings (if using XAMPP/WAMP):
echo - Host: localhost
echo - Username: root
echo - Password: (leave empty)
echo - Database: matomo
echo.
echo After installation, you'll get:
echo - Matomo URL: http://localhost/matomo
echo - Site ID: 1
echo - Auth Token: (from Matomo admin)
echo.
echo Press any key to continue...
pause > nul
