# PostgreSQL Database Setup for Windows

## Step 1: Start PostgreSQL Service

### Option A: Using Services (Recommended)
1. Press `Windows + R`
2. Type `services.msc` and press Enter
3. Find "postgresql-x64-17" (or similar)
4. Right-click and select "Start"
5. Set startup type to "Automatic"

### Option B: Using Command Line (Run as Administrator)
```cmd
# Open Command Prompt as Administrator
net start postgresql-x64-17
```

### Option C: Using pgAdmin
1. Open pgAdmin 4
2. Connect to PostgreSQL server
3. The service should start automatically

## Step 2: Set PostgreSQL Password

### Using psql (Command Line)
```cmd
# Connect to PostgreSQL as postgres user
psql -U postgres

# Set password for postgres user
ALTER USER postgres PASSWORD 'password';

# Exit psql
\q
```

### Using pgAdmin (GUI)
1. Open pgAdmin 4
2. Connect to server
3. Right-click on "Login/Group Roles" → "postgres"
4. Go to "Definition" tab
5. Set password to "password"
6. Click "Save"

## Step 3: Create Database and User

### Using psql
```cmd
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE maiko_edu;

# Create user
CREATE USER maiko_user WITH PASSWORD 'password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE maiko_edu TO maiko_user;

# Exit
\q
```

### Using pgAdmin
1. Right-click "Databases" → "Create" → "Database"
2. Name: `maiko_edu`
3. Click "Save"
4. Right-click "Login/Group Roles" → "Create" → "Login/Group Role"
5. Name: `maiko_user`
6. Go to "Definition" tab, set password: `password`
7. Go to "Privileges" tab, check "Can login"
8. Click "Save"

## Step 4: Test Connection

```cmd
# Test connection with new user
psql -U maiko_user -d maiko_edu -h localhost

# You should see:
# Password for user maiko_user: [enter password]
# maiko_edu=>

# Exit
\q
```

## Step 5: Update .env File

Make sure your .env file has the correct database credentials:

```env
DATABASE_URL=postgresql://maiko_user:password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=maiko_user
DB_PASSWORD=password
```

## Troubleshooting

### Common Issues

1. **"password authentication failed"**
   - Solution: Set the postgres user password as shown above

2. **"connection refused"**
   - Solution: Start PostgreSQL service

3. **"database does not exist"**
   - Solution: Create the database as shown above

4. **"permission denied"**
   - Solution: Grant proper privileges to the user

### Alternative: Use Default postgres User

If you prefer to use the default postgres user:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=postgres
DB_PASSWORD=password
```

## Next Steps

After database setup:
1. Run: `cd server && npx sequelize-cli db:migrate`
2. Run: `node scripts/setup-networking-labs.js`
3. Start the application: `npm start`

