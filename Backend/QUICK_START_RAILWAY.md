# Quick Start: Deploy to Railway

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push
```

### 2. Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `health-app` repository
5. Select the `Backend` folder as root directory

### 3. Add Database

**Option A: Railway PostgreSQL (Easiest)**
1. In Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway auto-creates `DATABASE_URL` variable
3. **Note**: You'll need to add PostgreSQL dependency (see below)

**Option B: External MySQL (Free Options)**

Choose one of these free MySQL hosting services:

**Option B1: PlanetScale (Recommended - Free Tier)**
1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create a new database
4. Get connection details:
   - Host: `aws.connect.psdb.cloud` (or similar)
   - Port: `3306`
   - Database name: Your database name
   - Username: Your username
   - Password: Generate a password
5. **Important**: PlanetScale uses SSL, so your connection string format is:
   ```
   DATABASE_URL=jdbc:mysql://aws.connect.psdb.cloud:3306/your-db-name?sslMode=REQUIRED
   ```
6. Add to Railway Variables:
   - `DATABASE_URL=jdbc:mysql://aws.connect.psdb.cloud:3306/your-db-name?sslMode=REQUIRED`
   - `DB_USERNAME=your-planetscale-username`
   - `DB_PASSWORD=your-planetscale-password`

**Option B2: Aiven (Free Tier)**
1. Go to https://aiven.io
2. Sign up (free tier available)
3. Create MySQL service
4. Get connection details from Aiven dashboard
5. Add to Railway Variables:
   - `DATABASE_URL=jdbc:mysql://your-host.aivencloud.com:port/your-db-name?sslMode=REQUIRED`
   - `DB_USERNAME=avnadmin` (or your username)
   - `DB_PASSWORD=your-password`

**Option B3: FreeMySQLHosting**
1. Go to https://www.freemysqlhosting.net
2. Sign up for free account
3. Create database
4. Get connection details
5. Add to Railway Variables:
   - `DATABASE_URL=jdbc:mysql://your-host.freemysqlhosting.net:3306/your-db-name`
   - `DB_USERNAME=your-username`
   - `DB_PASSWORD=your-password`

**Option B4: Use Your Existing Local MySQL (via ngrok)**
If you want to use your local MySQL database:
1. Install ngrok: https://ngrok.com
2. Start ngrok tunnel: `ngrok tcp 3306`
3. Get the ngrok TCP URL (e.g., `0.tcp.ngrok.io:12345`)
4. Add to Railway Variables:
   - `DATABASE_URL=jdbc:mysql://0.tcp.ngrok.io:12345/health-app`
   - `DB_USERNAME=root`
   - `DB_PASSWORD=your-local-password`
5. **Note**: Keep ngrok running while Railway app is deployed

### 4. Add Environment Variables

In Railway → Your Service → Variables, add:

```
JWT_SECRET=your-secret-key-at-least-64-characters-long-random-string
JWT_EXPIRATION=1800000
PORT=8080
```

**For External MySQL (if not using Railway PostgreSQL):**
```
DATABASE_URL=jdbc:mysql://your-host:3306/health-app
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

**Important Notes for MySQL Connection Strings:**
- **If SSL is required** (most cloud providers): Add `?sslMode=REQUIRED` to DATABASE_URL
  - Format: `jdbc:mysql://host:port/dbname?sslMode=REQUIRED`
- **Standard format**: `jdbc:mysql://host:port/database-name`
- **Port**: Usually `3306`, but check your provider's documentation
- **Host**: Provided by your MySQL hosting service
- **Database name**: The database you created (e.g., `health-app`)

**Example Connection Strings:**
- PlanetScale: `jdbc:mysql://aws.connect.psdb.cloud:3306/your-db?sslMode=REQUIRED`
- Aiven: `jdbc:mysql://your-host.aivencloud.com:12345/your-db?sslMode=REQUIRED`
- Standard MySQL: `jdbc:mysql://your-host:3306/health-app`

### 5. Deploy
- Railway will auto-detect Spring Boot and build
- Watch build logs
- Get your Railway URL (e.g., `https://your-app.railway.app`)

### 6. Update CORS
After getting Railway URL, update `WebSecurity.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "https://health-app-ivory-one.vercel.app",
    "https://your-app.railway.app"  // Your Railway URL
));
```
Commit and push - Railway will auto-redeploy.

### 7. Update Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_URL=https://your-app.railway.app/api`
3. Redeploy Vercel

## If Using Railway PostgreSQL

Add to `pom.xml` (after MySQL dependency):
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

Update `application.properties`:
```properties
spring.datasource.driver-class-name=org.postgresql.Driver
```

## Verify Deployment

1. Check Railway logs for startup success
2. Test: `https://your-app.railway.app/api/user/login` (should return error, not 404)
3. Test login from Vercel deployment

## Common Issues

**Build fails**: 
- Check Java version (needs 17)
- Verify `pom.xml` is correct
- Check Railway build logs for specific errors

**Database connection error**: 
- Verify DATABASE_URL format is correct
- **For cloud MySQL providers**: Add `?sslMode=REQUIRED` to DATABASE_URL
- Check DB_USERNAME and DB_PASSWORD are correct
- Ensure database host allows connections from Railway IPs (most cloud providers do by default)
- Verify database exists and is accessible
- Check Railway logs for specific database error messages
- **PlanetScale/Aiven**: Make sure you're using the correct host and port from their dashboard

**CORS error**: 
- Add Railway domain to CORS config in `WebSecurity.java`
- Redeploy backend after CORS changes
- Check browser console for specific CORS error

**Port error**: 
- Ensure PORT variable is set (Railway sets this automatically)
- Check Railway logs for port binding errors

**SSL/TLS error with MySQL**: 
- Add `?sslMode=REQUIRED` to DATABASE_URL for cloud MySQL providers
- Example: `jdbc:mysql://host:port/db?sslMode=REQUIRED`

## Testing MySQL Connection Locally

Before deploying, test your external MySQL connection locally:

1. Temporarily update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://your-external-host:3306/health-app?sslMode=REQUIRED
   spring.datasource.username=your-username
   spring.datasource.password=your-password
   ```

2. Start Spring Boot locally: `./mvnw spring-boot:run`

3. Check if it connects successfully (look for "HikariPool" connection messages)

4. Revert to localhost config after testing

