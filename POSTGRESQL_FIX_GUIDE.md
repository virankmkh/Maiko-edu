# PostgreSQL Setup Fix Guide

## The Issue
PostgreSQL is installed but we can't connect with the default credentials.

## Solution Options

### Option 1: Use pgAdmin (Recommended - Easiest)

1. **Open pgAdmin 4** (should be installed with PostgreSQL)
2. **Connect to PostgreSQL server**:
   - Right-click "Servers" → "Create" → "Server"
   - Name: `PostgreSQL 17`
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: Try these in order:
     - Empty (no password)
     - `postgres`
     - `admin`
     - `password`
3. **Once connected**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `maiko_edu`
   - Click "Save"
4. **Note the working password** for the .env file

### Option 2: Reset PostgreSQL Password

1. **Open Command Prompt as Administrator**
2. **Stop PostgreSQL service**:
   ```cmd
   net stop postgresql-x64-17
   ```
3. **Start PostgreSQL in single-user mode**:
   ```cmd
   "C:\Program Files\PostgreSQL\17\bin\postgres.exe" --single -D "C:\Program Files\PostgreSQL\17\data" postgres
   ```
4. **In the PostgreSQL prompt, run**:
   ```sql
   ALTER USER postgres PASSWORD 'password';
   \q
   ```
5. **Start PostgreSQL service**:
   ```cmd
   net start postgresql-x64-17
   ```

### Option 3: Use Windows Authentication

1. **Open Command Prompt as Administrator**
2. **Connect using Windows authentication**:
   ```cmd
   psql -U postgres -h localhost
   ```
3. **Set password**:
   ```sql
   ALTER USER postgres PASSWORD 'password';
   \q
   ```

### Option 4: Reinstall PostgreSQL

1. **Uninstall PostgreSQL** from Control Panel
2. **Download fresh installer** from https://www.postgresql.org/download/windows/
3. **During installation**:
   - Set password for postgres user to `password`
   - Note the port (usually 5432)
   - Note the data directory

## After Getting PostgreSQL Working

### 1. Test Connection
```cmd
psql -U postgres -h localhost
# Enter password when prompted
# You should see: postgres=#
```

### 2. Create Database
```sql
CREATE DATABASE maiko_edu;
\q
```

### 3. Update .env File
Update your .env file with the working credentials:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=postgres
DB_PASSWORD=password
```

### 4. Test Setup
```cmd
node test-setup.js
```

## Quick Test Commands

### Test if PostgreSQL is running:
```cmd
netstat -an | findstr :5432
```

### Test connection:
```cmd
psql -U postgres -h localhost
```

### List databases:
```sql
\l
```

### Create database:
```sql
CREATE DATABASE maiko_edu;
```

## Alternative: Use SQLite (For Testing)

If PostgreSQL continues to be problematic, you can use SQLite for testing:

1. **Install SQLite**:
   ```cmd
   npm install sqlite3
   ```

2. **Update .env**:
   ```env
   DATABASE_URL=sqlite://./maiko_edu.db
   ```

3. **Update database config** in `server/config/database.js`:
   ```javascript
   const sequelize = new Sequelize('sqlite://./maiko_edu.db');
   ```

## Troubleshooting

### Common Issues:

1. **"password authentication failed"**
   - Solution: Reset password using Option 2 or 3 above

2. **"connection refused"**
   - Solution: Start PostgreSQL service
   ```cmd
   net start postgresql-x64-17
   ```

3. **"database does not exist"**
   - Solution: Create database using pgAdmin or SQL commands

4. **"permission denied"**
   - Solution: Run Command Prompt as Administrator

## Next Steps

Once PostgreSQL is working:
1. Run: `node test-setup.js`
2. Run: `cd server && node scripts/setup-database.js`
3. Start the application: `cd server && npm start`
4. Start the client: `cd client && npm start`

## Need Help?

If you're still having issues:
1. Try Option 1 (pgAdmin) first - it's the easiest
2. Check PostgreSQL service status in Windows Services
3. Look at PostgreSQL logs in `C:\Program Files\PostgreSQL\17\data\log\`
4. Consider using SQLite for testing (simpler setup)

