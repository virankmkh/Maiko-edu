@echo off
echo ========================================
echo Maiko EDU Networking Labs Setup
echo ========================================
echo.

echo Step 1: Creating .env file...
copy env-template.txt .env
echo .env file created successfully!
echo.

echo Step 2: Installing dependencies...
cd server
call npm install
cd ..\client
call npm install
echo Dependencies installed successfully!
echo.

echo Step 3: Setting up database...
cd ..\server
echo Please ensure PostgreSQL is running and create database 'maiko_edu'
echo You can do this by running:
echo   createdb maiko_edu
echo   psql -U postgres -c "CREATE USER maiko_user WITH PASSWORD 'password';"
echo   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE maiko_edu TO maiko_user;"
echo.

echo Step 4: Running database migrations...
call npx sequelize-cli db:migrate
echo Database migrations completed!
echo.

echo Step 5: Running setup script...
call node scripts/setup-networking-labs.js
echo Setup script completed!
echo.

echo Step 6: Building client...
cd ..\client
call npm run build
echo Client build completed!
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Set up EVE-NG server (see EVE-NG-SETUP.md)
echo 2. Update .env file with EVE-NG credentials
echo 3. Start the server: cd server && npm start
echo 4. Start the client: cd client && npm start
echo.
pause

