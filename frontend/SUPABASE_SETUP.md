# Supabase Profile Picture Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `health-app` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest region
4. Click "Create new project" and wait for setup to complete

## Step 2: Create Storage Bucket

1. In your Supabase project dashboard, go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Configure the bucket:
   - **Name**: `profile-pictures`
   - **Public bucket**: ✅ Check this (allows public read access)
   - Click **"Create bucket"**

## Step 3: Configure Bucket Policies (REQUIRED)

Since this app uses its own JWT authentication (not Supabase Auth), we need to configure policies that allow public uploads.

### Option A: Simple Setup (Recommended for Development)

1. Go to **Storage** > **Policies** > `profile-pictures`
2. Click **"New Policy"** or use **"Quick Templates"**
3. Create these policies:

   **Policy 1: Allow public read access**
   - Policy name: `Public Read Access`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     true
     ```

   **Policy 2: Allow public uploads**
   - Policy name: `Public Upload`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     true
     ```

   **Policy 3: Allow public updates**
   - Policy name: `Public Update`
   - Allowed operation: `UPDATE`
   - Policy definition:
     ```sql
     true
     ```

   **Policy 4: Allow public deletes**
   - Policy name: `Public Delete`
   - Allowed operation: `DELETE`
   - Policy definition:
     ```sql
     true
     ```

### Option B: Disable RLS (Alternative)

If you prefer to disable RLS entirely for this bucket:

1. Go to **Storage** > **Policies** > `profile-pictures`
2. Click on the bucket settings (gear icon)
3. Toggle **"Public bucket"** to ON
4. This will allow all operations without RLS policies

**Note**: Option A is more secure as it explicitly defines what's allowed. Option B is simpler but less secure.

## Step 4: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 5: Configure Environment Variables

1. Create a `.env` file in the `frontend` directory (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual Supabase credentials
4. **Important**: Restart your development server after adding environment variables

## Step 6: Test the Integration

1. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the Profile page
3. Click the camera icon to upload a profile picture
4. Select an image file (JPEG, PNG, GIF, or WebP, max 5MB)
5. The image should upload to Supabase and display in your profile

## Troubleshooting

### "Supabase URL or Anon Key is missing"
- Make sure you've created the `.env` file in the `frontend` directory
- Verify the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/updating `.env`

### "Failed to upload image" or "new row violates row-level security policy"
- **This is the most common issue!** You need to configure RLS policies
- Go to **Storage** > **Policies** > `profile-pictures`
- Make sure you have policies that allow `INSERT` operations
- Use the policies from **Step 3** above (Option A recommended)
- If using Option A, ensure all 4 policies are created (SELECT, INSERT, UPDATE, DELETE)
- Verify the bucket exists and is accessible
- Check browser console for detailed error messages
- Ensure file size is under 5MB and file type is supported

### Image not displaying
- Check that the URL stored in the database is accessible
- Verify the bucket has public read access enabled
- Check browser console for CORS or network errors

## File Structure

After setup, your files should look like:

```
frontend/
├── .env                    # Your Supabase credentials (not committed to git)
├── src/
│   ├── services/
│   │   ├── supabaseClient.ts    # Supabase client initialization
│   │   └── imageUpload.ts        # Image upload utility
│   └── components/
│       └── Profile.tsx            # Updated profile component
```

## Security Notes

- Never commit your `.env` file to version control
- The anon key is safe to use in frontend code (it's designed for public use)
- For production, consider implementing Row Level Security (RLS) policies in Supabase
- File uploads are limited to 5MB and specific image types for security

