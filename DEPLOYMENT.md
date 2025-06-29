# 🚀 SwiftChain Deployment Guide

This guide will help you deploy SwiftChain to production using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)
- MetaMask wallet with Sepolia testnet setup

## 🎯 Deployment Strategy

- **Frontend**: Vercel (React app)
- **Backend**: Railway (Node.js API)
- **Database**: Not required (uses localStorage for demo)

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Prepare Backend
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `SwiftChain` repository
5. Set the root directory to `server`

### 1.2 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 1.3 Deploy
1. Railway will automatically detect it's a Node.js app
2. Click "Deploy" and wait for the build to complete
3. Note the generated URL (e.g., `https://swiftchain-backend.railway.app`)

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project" → "Import Git Repository"
4. Select your `SwiftChain` repository
5. Set the root directory to `client`

### 2.2 Configure Build Settings
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 2.3 Configure Environment Variables
Add this environment variable:
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

### 2.4 Deploy
1. Click "Deploy" and wait for the build to complete
2. Your app will be available at `https://your-app-name.vercel.app`

## 🔧 Step 3: Update CORS Configuration

After getting your frontend URL, update the backend CORS settings:

1. Go back to Railway dashboard
2. Add your frontend URL to the `FRONTEND_URL` environment variable
3. Redeploy the backend

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL
2. Check if the app loads correctly
3. Test navigation between pages

### 4.2 Test Backend
1. Visit `https://your-backend-url.railway.app/api/health`
2. Should return: `{"status":"OK","message":"SwiftChain API is running"}`

### 4.3 Test API Integration
1. Try making a conversion in the app
2. Check browser console for any CORS errors
3. Verify MetaMask integration works

## 🔒 Step 5: Security Considerations

### 5.1 Environment Variables
- Never commit sensitive data to Git
- Use Railway's environment variable system
- Keep API keys and secrets secure

### 5.2 CORS Configuration
- Only allow your frontend domain
- Remove localhost from production CORS
- Test CORS with your actual domain

### 5.3 MetaMask Configuration
- Ensure users are on Sepolia testnet
- Test wallet connection thoroughly
- Verify transaction signing works

## 📊 Step 6: Monitoring and Maintenance

### 6.1 Railway Monitoring
- Check Railway dashboard for logs
- Monitor API response times
- Set up alerts for downtime

### 6.2 Vercel Analytics
- Enable Vercel Analytics
- Monitor page performance
- Track user interactions

### 6.3 Error Tracking
- Consider adding Sentry for error tracking
- Monitor console errors
- Set up health check alerts

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
```
Access to fetch at 'https://backend-url' from origin 'https://frontend-url' has been blocked by CORS policy
```
**Solution**: Update CORS configuration in backend with correct frontend URL

#### Build Failures
```
Build failed: npm run build
```
**Solution**: Check for missing dependencies or build errors in local development

#### API Connection Issues
```
Failed to fetch: NetworkError
```
**Solution**: Verify backend URL is correct and backend is running

#### MetaMask Issues
```
User rejected the request
```
**Solution**: Ensure users have MetaMask installed and are on Sepolia testnet

## 🔄 Continuous Deployment

### Automatic Deployments
- Both Vercel and Railway support automatic deployments
- Every push to main branch triggers deployment
- Use feature branches for testing

### Environment Management
- Use different environments for staging and production
- Test thoroughly before deploying to production
- Keep staging environment in sync with production

## 📈 Performance Optimization

### Frontend
- Enable Vercel's edge caching
- Optimize bundle size
- Use lazy loading for routes

### Backend
- Enable Railway's caching
- Optimize database queries (if using one)
- Use CDN for static assets

## 🎉 Success!

Your SwiftChain application is now deployed and accessible worldwide!

### Your URLs
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-backend-name.railway.app`
- **Health Check**: `https://your-backend-name.railway.app/api/health`

### Next Steps
1. Share your app with users
2. Monitor performance and errors
3. Gather feedback and iterate
4. Consider adding a custom domain
5. Set up SSL certificates (handled by Vercel/Railway)

## 📞 Support

If you encounter issues:
1. Check Railway and Vercel logs
2. Verify environment variables
3. Test locally first
4. Check CORS configuration
5. Ensure MetaMask is properly configured

---

**Happy Deploying! 🚀** 