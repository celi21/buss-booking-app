# Google and Apple OAuth Setup Guide for Render Deployment

## Overview
This guide will help you set up Google and Apple OAuth authentication for your bus booking application deployed on Render.

---

## Part 1: Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Bus Booking App")
4. Click "Create"

### Step 2: Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue" through all steps
4. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: "Bus Booking OAuth"
   - Authorized JavaScript origins:
     ```
     https://your-frontend-app.onrender.com
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     https://your-backend-app.onrender.com/api/oauth/google/callback
     http://localhost:8000/api/oauth/google/callback
     ```
5. Click "Create"
6. **SAVE** your Client ID and Client Secret

### Step 4: Add to Render Environment Variables
In your Render backend service, add these environment variables:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## Part 2: Apple OAuth Setup

### Step 1: Apple Developer Account
1. You need an **Apple Developer Account** ($99/year)
2. Go to [Apple Developer](https://developer.apple.com/)
3. Sign in with your Apple ID

### Step 2: Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" button
3. Select "App IDs" → Continue
4. Select "App" → Continue
5. Fill in:
   - Description: "Bus Booking App"
   - Bundle ID: `com.yourcompany.busbooking` (must be unique)
6. Check "Sign in with Apple"
7. Click "Continue" → "Register"

### Step 3: Create Service ID
1. Go to "Identifiers" → "+" button
2. Select "Services IDs" → Continue
3. Fill in:
   - Description: "Bus Booking Web Service"
   - Identifier: `com.yourcompany.busbooking.service`
4. Check "Sign in with Apple"
5. Click "Configure" next to Sign in with Apple:
   - Primary App ID: Select your App ID from Step 2
   - Domains and Subdomains:
     ```
     your-backend-app.onrender.com
     ```
   - Return URLs:
     ```
     https://your-backend-app.onrender.com/api/oauth/apple/callback
     ```
6. Click "Save" → "Continue" → "Register"

### Step 4: Create Private Key
1. Go to "Keys" → "+" button
2. Key Name: "Bus Booking Sign in with Apple Key"
3. Check "Sign in with Apple"
4. Click "Configure" → Select your Primary App ID
5. Click "Save" → "Continue" → "Register"
6. **DOWNLOAD** the `.p8` file (you can only download once!)
7. Note your **Key ID** (shown on the page)

### Step 5: Get Team ID
1. Go to "Membership" in the left sidebar
2. Copy your **Team ID**

### Step 6: Upload Private Key to Render
1. In your Render backend service, go to "Shell"
2. Create a directory for keys:
   ```bash
   mkdir -p /opt/render/project/src/keys
   ```
3. Upload your `.p8` file to Render:
   - Option A: Use Render's file upload in the Shell
   - Option B: Add the key content to environment variables (see below)

### Step 7: Add to Render Environment Variables
In your Render backend service, add these environment variables:
```
APPLE_CLIENT_ID=com.yourcompany.busbooking.service
APPLE_TEAM_ID=your_team_id_here
APPLE_KEY_ID=your_key_id_here
APPLE_PRIVATE_KEY_PATH=/opt/render/project/src/keys/AuthKey_XXXXXX.p8
```

**Alternative (if file upload is difficult):**
You can store the private key content as an environment variable:
```
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
(paste entire key content here)
-----END PRIVATE KEY-----
```

Then update `/server/config/passport.js` to use the key content instead of file path.

---

## Part 3: Update Render Environment Variables

### Backend Service Environment Variables
Add/update these in your Render backend service:

```bash
# Existing variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend-app.onrender.com
BACKEND_URL=https://your-backend-app.onrender.com
CORS_ORIGINS=https://your-frontend-app.onrender.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple OAuth
APPLE_CLIENT_ID=com.yourcompany.busbooking.service
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY_PATH=/opt/render/project/src/keys/AuthKey_XXXXXX.p8
```

### Frontend Service Environment Variables
Make sure you have:
```bash
REACT_APP_API_BASE_URL=https://your-backend-app.onrender.com/api
```

---

## Part 4: Testing

### Local Testing
1. Update your `.env` files with the credentials
2. Make sure callback URLs include `http://localhost:8000` and `http://localhost:3000`
3. Start both backend and frontend
4. Go to login page
5. Click "Sign in with Google" or "Sign in with Apple"

### Production Testing
1. Deploy to Render
2. Make sure all environment variables are set
3. Go to your production login page
4. Test both Google and Apple login

---

## Troubleshooting

### Google OAuth Issues
- **Error: redirect_uri_mismatch**
  - Check that your redirect URI in Google Console exactly matches: `https://your-backend-app.onrender.com/api/oauth/google/callback`
  - No trailing slashes
  - HTTPS in production

- **Error: invalid_client**
  - Double-check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Render

### Apple OAuth Issues
- **Error: invalid_client**
  - Verify APPLE_CLIENT_ID matches your Service ID
  - Check APPLE_TEAM_ID and APPLE_KEY_ID are correct

- **Error: invalid_request**
  - Ensure return URL in Apple Developer Console matches exactly
  - Check that private key file is accessible at APPLE_PRIVATE_KEY_PATH

- **Private key not found**
  - Verify the `.p8` file was uploaded correctly
  - Check file path in environment variable
  - Ensure file has read permissions

### General Issues
- **CORS errors**
  - Make sure FRONTEND_URL is in CORS_ORIGINS
  - Check that CORS is properly configured in backend

- **Redirect not working**
  - Verify FRONTEND_URL and BACKEND_URL are correct
  - Check that /auth/callback route exists in frontend

---

## Security Notes

1. **Never commit credentials** to Git
2. Use environment variables for all secrets
3. Rotate keys periodically
4. Monitor OAuth usage in Google/Apple consoles
5. Keep private keys secure and backed up

---

## Quick Reference

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. Redirects to `/api/oauth/google`
3. Google authenticates user
4. Redirects to `/api/oauth/google/callback`
5. Backend creates/finds user, generates JWT
6. Redirects to frontend `/auth/callback?token=...`
7. Frontend stores token and redirects to dashboard

### Apple OAuth Flow
Same as Google, but uses `/api/oauth/apple` and `/api/oauth/apple/callback`

---

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test OAuth credentials in Google/Apple consoles
5. Ensure callback URLs are whitelisted

---

**Last Updated:** December 2025
