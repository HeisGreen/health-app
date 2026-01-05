# Vercel Deployment Configuration Guide

## Environment Variables Setup

To connect your deployed frontend to your backend API, you need to set up environment variables in Vercel.

### Step 1: Get Your Backend URL

1. Determine your backend deployment URL (e.g., `https://your-backend.herokuapp.com` or `https://your-backend.railway.app`)
2. Make sure it includes the `/api` path if your backend serves APIs under `/api`

### Step 2: Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)
   - **Environment**: Select all (Production, Preview, Development)

### Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

## Example Environment Variables

### For Production Backend:
```
VITE_API_URL=https://your-backend-domain.com/api
```

### For Local Development (optional, already defaults to localhost):
```
VITE_API_URL=http://localhost:8080/api
```

## Important Notes

- Environment variables prefixed with `VITE_` are exposed to the browser
- Make sure your backend CORS settings allow requests from `https://health-app-ivory-one.vercel.app`
- The backend URL should include the `/api` path if your backend serves APIs under that path
- After updating environment variables, you must redeploy for changes to take effect

## Troubleshooting

### Still getting "incorrect email or password"?
1. Check browser console (F12) for network errors
2. Verify the `VITE_API_URL` is set correctly in Vercel
3. Check that your backend is running and accessible
4. Verify CORS settings on your backend allow requests from your Vercel domain
5. Check backend logs to see if requests are reaching the server

### CORS Errors?
Make sure your backend CORS configuration includes:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173", 
    "https://health-app-ivory-one.vercel.app"
));
```

### Network Errors?
- Verify your backend URL is correct and accessible
- Check if your backend requires HTTPS
- Ensure your backend is not blocking requests from Vercel

