# Deployment Guide

## Free Deployment Options for Developer Hub

### 🎯 Recommended Setup (100% Free)

#### Frontend: Vercel + Backend: Render + Database: MongoDB Atlas

---

## Option 1: Vercel (Frontend) + Render (Backend) - Recommended

### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Prepare Backend for Deployment**
   ```bash
   # Your backend is already ready!
   # Just update these environment variables in Render:
   ```

3. **Create Web Service on Render**
   - Click "New+" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** developer-hub-backend
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
     - **Instance Type:** Free

4. **Add Environment Variables in Render:**
   ```
   MONGO_URI=mongodb+srv://bhargavi21:Bhargavi123@cluster0.kiks8eo.mongodb.net/devhub
   JWT_SECRET=devhub_secure_jwt_secret_key_2024_production_ready
   JWT_REFRESH_SECRET=devhub_refresh_token_secret_key_2024_secure_random_string
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@developerhub.com
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   SESSION_SECRET=devhub_session_secret_key_2024_secure_random_string_for_production
   ```

5. **Deploy!** - Render will provide a URL like: `https://developer-hub-backend.onrender.com`

---

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add New Project"
   - Select your GitHub repository
   - Configure:
     - **Framework Preset:** Angular
     - **Root Directory:** `Frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist/Frontend/browser`

3. **Add Environment Variables in Vercel:**
   ```
   API_URL=https://developer-hub-backend.onrender.com
   ```

4. **Deploy!** - Vercel will provide a URL like: `https://developer-hub-frontend.vercel.app`

---

## Option 2: Railway (All-in-one)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will detect both frontend and backend

3. **Configure Services**
   - **Backend Service:**
     - Root directory: `backend`
     - Start command: `node server.js`
   
   - **Frontend Service:**
     - Root directory: `Frontend`
     - Build command: `npm run build`
     - Start command: `npx serve dist/Frontend/browser -s -n`

4. **Add Environment Variables**
   - Same as above, but use Railway's provided domain

---

## Option 3: Netlify (Frontend) + Render (Backend)

### Deploy Frontend to Netlify:

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)

2. **Deploy**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Configure:
     - **Build command:** `npm run build`
     - **Publish directory:** `Frontend/dist/Frontend/browser`

3. **Add Environment Variables:**
   ```
   API_URL=https://developer-hub-backend.onrender.com
   ```

---

## 📝 Important Deployment Notes

### Update CORS Origins:
After getting your deployed URLs, update `ALLOWED_ORIGINS` in backend:
```
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.vercel.app
```

### Update Frontend API URL:
In your frontend code, update API calls to use deployed backend URL instead of localhost.

### MongoDB Atlas:
- Already configured and working!
- Free tier: 512MB storage
- No changes needed

---

## 🔧 Pre-Deployment Checklist

- [ ] Update `ALLOWED_ORIGINS` with frontend URL
- [ ] Update `FRONTEND_URL` in backend `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure email credentials (if using email features)
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test file uploads (if using S3 or local storage)

---

## 🎉 Free Tier Limitations

### Render Free Tier:
- 512MB RAM
- 0.1 CPU
- Spins down after 15 mins inactivity
- Cold start ~30 seconds

### Vercel Free Tier:
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL

### MongoDB Atlas Free Tier:
- 512MB storage
- Shared RAM
- Good for development/small projects

---

## 🚀 Post-Deployment Steps

1. **Test Your Application**
   - Visit frontend URL
   - Test registration/login
   - Test all features

2. **Monitor Performance**
   - Use Render logs for backend
   - Use Vercel analytics for frontend

3. **Set Up Monitoring (Optional)**
   - Uptime monitoring
   - Error tracking

---

## 💡 Pro Tips

1. **Use Custom Domains:** Both platforms support custom domains
2. **Enable Auto-Deploy:** Connect to GitHub for automatic deployments
3. **Monitor Logs:** Check logs regularly for errors
4. **Scale Up:** Upgrade to paid tiers when needed

---

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update `ALLOWED_ORIGINS` with correct frontend URL

2. **MongoDB Connection:**
   - Check IP whitelist in MongoDB Atlas
   - Verify connection string

3. **Email Not Working:**
   - Use App Password instead of regular password
   - Check SMTP settings

4. **Build Failures:**
   - Check build logs
   - Ensure all dependencies are in package.json

---

## 📞 Support

For deployment issues:
- Render: [render.com/docs](https://render.com/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- MongoDB: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

## ✅ Quick Start Commands

### Backend Deployment:
```bash
# Already configured - just deploy to Render!
# Or test locally:
cd backend
npm install
node server.js
```

### Frontend Deployment:
```bash
# Already configured - just deploy to Vercel!
# Or test locally:
cd Frontend
npm install
ng build
```

---

Your project is **deployment-ready!** 🎉
All security fixes, UI consistency, and functionality improvements are complete.