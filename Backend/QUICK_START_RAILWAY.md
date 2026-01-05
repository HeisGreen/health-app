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

**Option B: External MySQL**
- Use free MySQL hosting (PlanetScale, Aiven, etc.)
- Add these variables:
  - `DATABASE_URL=jdbc:mysql://host:3306/dbname`
  - `DB_USERNAME=username`
  - `DB_PASSWORD=password`

### 4. Add Environment Variables

In Railway → Your Service → Variables, add:

```
JWT_SECRET=your-secret-key-at-least-64-characters-long-random-string
JWT_EXPIRATION=1800000
PORT=8080
```

**For MySQL (if not using Railway PostgreSQL):**
```
DATABASE_URL=jdbc:mysql://your-host:3306/health-app
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

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

**Build fails**: Check Java version (needs 17)
**Database error**: Verify DATABASE_URL format
**CORS error**: Add Railway domain to CORS config
**Port error**: Ensure PORT variable is set (Railway sets this automatically)

