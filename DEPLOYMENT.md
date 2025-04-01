# ArtificeAI Deployment Guide

## Project Overview

ArtificeAI is a comprehensive web-based React application for AI image generation with multiple advanced features. The application provides:

- Text-to-image generation using DALL-E 3
- Image-to-image transformation
- Face cloning and editing
- Custom AI model tuning

## Authentication Features

- Firebase Google Authentication
- Custom email/password authentication
- Guest access with login prompts for protected actions

## Deployment Prerequisites

1. Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `VITE_FIREBASE_API_KEY`: Firebase API key
   - `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
   - `VITE_FIREBASE_APP_ID`: Firebase app ID
   - `DATABASE_URL`: PostgreSQL database connection string (if using database)

2. Firebase Configuration:
   - Enable Google Authentication in Firebase Console
   - Add your deployment domain to Firebase authorized domains
   - Set up Firebase Firestore for user data storage

## Deployment Steps

### 1. Build for Production

```bash
npm run build
```

This will:
- Bundle the client-side code using Vite
- Bundle the server-side code using esbuild
- Output production files to the `dist` directory

### 2. Start Production Server

```bash
NODE_ENV=production npm start
```

Or on Windows:
```cmd
set NODE_ENV=production&npm start
```

### 3. Replit Deployment

Click the "Deploy" button on the Replit interface to deploy the application to a production environment.

## Post-Deployment Configuration

1. Update Firebase authorized domains with your production domain
2. Test all authentication methods (Google, email/password, guest access)
3. Verify image generation works with valid prompts

## Troubleshooting

### Firebase Authentication Errors

If you encounter the error `Firebase: Error (auth/configuration-not-found)`:
1. Verify your deployment domain is added to Firebase Console under Authentication > Settings > Authorized Domains
2. Check that all Firebase environment variables are correctly set
3. Ensure the app is accessed via HTTPS if required by Firebase settings

### OpenAI API Errors

If image generation fails:
1. Verify your OpenAI API key is valid and correctly set
2. Check for error messages in server logs
3. Ensure prompts comply with OpenAI content policy

## Security Considerations

1. Never expose API keys in client-side code
2. Use environment variables for all sensitive information
3. Implement appropriate rate limiting for API usage
4. Follow the principle of least privilege for Firebase rules

## Performance Considerations

1. Image assets are lazy-loaded for better performance
2. Components use React.memo to prevent unnecessary re-renders
3. React Query optimizes data fetching with caching strategies