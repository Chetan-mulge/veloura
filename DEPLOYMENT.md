# Veloura Deployment Guide

## Frontend → Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your GitHub repo
3. Framework Preset: **Other**
4. Root Directory: `.` (leave as root)
5. No build command needed
6. Click Deploy!

## Backend → Render
1. Go to render.com → New Web Service
2. Connect your GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Environment Variables (add these in Render dashboard):
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `RAZORPAY_SECRET` = your Razorpay secret key
   - `PORT` = 5000

## After deployment
1. Copy your Render backend URL (looks like: https://veloura-backend.onrender.com)
2. Open `scripts/config.js`
3. Replace the URL with your actual Render URL
4. Push to GitHub — Vercel auto-redeploys

## IMPORTANT — .env file
Never push your .env file. It's in .gitignore.
Add the env variables manually in Render's dashboard.
