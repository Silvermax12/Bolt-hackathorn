# 🚀 Deploying to Render

Follow these steps to deploy your Landing Page Generator backend to Render:

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Netlify Token**: Have your Netlify Personal Access Token ready

## 🔧 Deployment Steps

### 1. Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial backend deployment"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository and branch

### 3. Configure Service Settings

**Basic Settings:**
- **Name**: `landing-page-generator-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (important!)

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn -c gunicorn_config.py app:app`

### 4. Set Environment Variables

In the Render dashboard, add these environment variables:

| Variable | Value |
|----------|-------|
| `NETLIFY_TOKEN` | Your Netlify Personal Access Token |
| `FLASK_ENV` | `production` |
| `FLASK_DEBUG` | `false` |
| `MAX_DEPLOYS_PER_HOUR` | `10` |

### 5. Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (usually 2-5 minutes)
3. Your backend will be available at: `https://your-service-name.onrender.com`

## 🧪 Testing Your Deployment

Once deployed, test these endpoints:

- **Health Check**: `GET https://your-service.onrender.com/health`
- **Preview**: `POST https://your-service.onrender.com/api/preview`
- **Deploy**: `POST https://your-service.onrender.com/api/deploy`

## 🔧 Update Frontend Configuration

Update your frontend's API configuration to use the new Render URL:

```typescript
// In your frontend's API configuration
const API_BASE_URL = 'https://your-service-name.onrender.com';
```

## 📝 Important Notes

- **Free Tier**: Render free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request after sleep may take 30-60 seconds
- **Logs**: View real-time logs in Render dashboard
- **SSL**: HTTPS is automatically enabled

## 🔒 Security

- Never commit your Netlify token to Git
- Environment variables are encrypted on Render
- CORS is configured for your frontend domain

## 🐛 Troubleshooting

**Common Issues:**

1. **Build Fails**: Check requirements.txt dependencies
2. **App Won't Start**: Verify gunicorn_config.py syntax
3. **Environment Variables**: Ensure NETLIFY_TOKEN is set correctly
4. **CORS Errors**: Update CORS settings if needed

**View Logs:**
```bash
# From Render dashboard → Your service → Logs
```

---

🎉 **Your backend is now live and ready to deploy landing pages!** 