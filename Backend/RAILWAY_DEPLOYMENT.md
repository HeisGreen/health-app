# Railway Deployment Guide

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (recommended for easy deployment)
3. You'll get $5 free credit per month

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo" (recommended)
   - Or select "Empty Project" and connect GitHub later
3. Select your repository: `health-app`
4. Railway will detect it's a Spring Boot application

## Step 3: Configure Service

1. Railway will create a service for your backend
2. Go to the service settings
3. Set the **Root Directory** to `Backend` (if deploying from monorepo)

## Step 4: Add Environment Variables

Go to **Variables** tab and add:

### Required Variables:

```
DATABASE_URL=jdbc:mysql://your-mysql-host:3306/health-app
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
JWT_SECRET=your-secret-key-min-64-characters-long
JWT_EXPIRATION=1800000
PORT=8080
```

### Database Options:

**Option A: Use Railway PostgreSQL (Free Tier)**
1. In Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically create `DATABASE_URL` environment variable
3. Update `application.properties` to support PostgreSQL OR keep MySQL

**Option B: Use External MySQL**
- Use a free MySQL service like:
  - **PlanetScale** (free tier)
  - **Aiven** (free tier)
  - **FreeMySQLHosting**
- Or use your existing MySQL database

**Note**: If using PostgreSQL, you'll need to:
1. Add PostgreSQL dependency to `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```
2. Update `application.properties` driver class name

## Step 5: Deploy

1. Railway will automatically detect Spring Boot and build
2. Watch the build logs
3. Once deployed, Railway will provide a URL like: `https://your-app.railway.app`

## Step 6: Update CORS (After Getting Railway URL)

After deployment, update `WebSecurity.java` to include your Railway domain:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "https://health-app-ivory-one.vercel.app",
    "https://your-app.railway.app"  // Add your Railway URL here
));
```

Then redeploy to Railway.

## Step 7: Update Vercel Environment Variable

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add/Update: `VITE_API_URL=https://your-app.railway.app/api`
3. Redeploy Vercel frontend

## Step 8: Test

1. Verify backend is accessible: `https://your-app.railway.app/api/user/login`
2. Test login from Vercel deployment
3. Check Railway logs for any errors

## Troubleshooting

### Build Fails
- Check Railway build logs
- Ensure Java 17 is available (Railway auto-detects)
- Verify `pom.xml` is correct

### Database Connection Fails
- Verify `DATABASE_URL` format is correct
- Check database credentials
- Ensure database allows connections from Railway IPs
- For Railway PostgreSQL, the URL format is automatically set

### CORS Errors
- Add Railway domain to CORS allowed origins
- Redeploy backend after CORS changes
- Check browser console for specific CORS error

### Application Crashes
- Check Railway logs
- Verify all environment variables are set
- Check database connectivity
- Verify JWT_SECRET is set (minimum 64 characters recommended)

## Railway Free Tier Notes

- $5 free credit per month
- 512MB RAM
- Auto-sleeps after inactivity (wakes automatically on request)
- Suitable for development and small production apps
- Consider upgrading if you need more resources

## Useful Railway Commands (CLI)

Install Railway CLI:
```bash
npm i -g @railway/cli
railway login
railway link  # Link to your project
railway logs  # View logs
railway variables  # View environment variables
```

