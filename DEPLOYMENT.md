# Deployment Guide

This document describes the automated CI/CD deployment process for Dagboken.

## 🚀 Deployment Flow

```
Developer pushes to main
         ↓
GitHub Actions: Lint & Test (2-5 min)
         ↓
GitHub Actions: Build Docker Images (3-5 min)
         ↓
GitHub Actions: Push to Docker Hub
         ↓
GitHub Actions: Trigger Render Webhooks (instant)
         ↓
Render: Pull & Deploy New Images (2-5 min)
         ↓
✅ Application Live!

Total Time: ~10-15 minutes
```

## 📋 Prerequisites

### 1. Docker Hub Setup

- Account created at https://hub.docker.com/
- Repositories created:
  - `your-username/dagboken-backend` (Public)
  - `your-username/dagboken-frontend` (Public)
- Access token created with Read/Write/Delete permissions

### 2. MongoDB Atlas Setup

- Free M0 cluster created at https://cloud.mongodb.com/
- Database user created with read/write permissions
- Network access set to `0.0.0.0/0` (allows all IPs - required for Render free tier)
- Connection string obtained

### 3. Render Setup

- Account created at https://render.com/
- Two web services created from existing Docker images:
  - Backend: `your-username/dagboken-backend:latest`
  - Frontend: `your-username/dagboken-frontend:latest`
- Deploy hooks obtained from each service

### 4. GitHub Secrets

Add these secrets in GitHub repo → Settings → Secrets and variables → Actions:

```
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=dckr_pat_xxxxxxxxxxxxx
RENDER_BACKEND_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx
RENDER_FRONTEND_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx
```

## 🔧 Render Service Configuration

### Backend Service

```
Type: Web Service
Image: your-username/dagboken-backend:latest
Region: Frankfurt (EU Central)
Plan: Free

Environment Variables:
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dagboken?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-production-key-min-32-chars
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend Service

```
Type: Web Service
Image: your-username/dagboken-frontend:latest
Region: Frankfurt (EU Central)
Plan: Free

Environment Variables:
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_BASE_URL=https://dagboken-backend.onrender.com
```

**⚠️ Important:** Update `NEXT_PUBLIC_API_BASE_URL` with your actual backend URL!

## 🔄 How Auto-Deploy Works

### On Pull Request:
```yaml
✅ Job 1: Lint (all platforms)
✅ Job 2: Docker Integration Tests
⏭️  Job 3: Build & Push (SKIPPED - not on main)
⏭️  Job 4: Trigger Deploy (SKIPPED - not on main)
✅ Job 5: All Checks Passed
```

### On Merge to Main:
```yaml
✅ Job 1: Lint (all platforms)
✅ Job 2: Docker Integration Tests
✅ Job 3: Build & Push to Docker Hub
   ├─ Build backend image
   ├─ Push dagboken-backend:latest
   ├─ Push dagboken-backend:<commit-sha>
   ├─ Build frontend image
   ├─ Push dagboken-frontend:latest
   └─ Push dagboken-frontend:<commit-sha>
✅ Job 4: Trigger Render Deployment
   ├─ Trigger backend webhook
   └─ Trigger frontend webhook
✅ Job 5: All Checks Passed
```

## 📊 Monitoring Deployments

### GitHub Actions
- Go to: https://github.com/your-username/your-repo/actions
- Click on latest workflow run
- Check each job's status and logs

### Docker Hub
- Go to: https://hub.docker.com/
- Check repositories for new `:latest` tags
- Verify "Last pushed" timestamp

### Render Dashboard
- Go to: https://dashboard.render.com/
- Click on each service
- Check **"Events"** tab for deploy status
- Check **"Logs"** tab for runtime logs

### Live Application
```bash
# Check backend health
curl https://dagboken-backend.onrender.com/health

# Expected response:
{
  "status": "OK",
  "version": "1.0.1",
  "timestamp": "2024-11-12T...",
  "uptime": 123.45,
  "environment": "production",
  "mongodb": "connected"
}

# Visit frontend
open https://dagboken-frontend.onrender.com
```

## 🔒 Security Best Practices

### ✅ Credentials
- All secrets stored in GitHub Secrets (encrypted)
- `.env` file in `.gitignore` (never committed)
- Strong random JWT_SECRET (64+ hex characters)
- MongoDB uses strong password and TLS encryption

### ✅ CORS Configuration
- Production: Only allows frontend domain
- Development: Allows localhost and 127.0.0.1

### ✅ Network Security
- MongoDB Atlas: Password + TLS encryption
- Render: Automatic HTTPS with free SSL certificates
- Docker Hub: Access token (not password)

## 🐛 Troubleshooting

### Deployment Not Triggered
**Symptom:** Merge to main but no deployment

**Check:**
1. Verify workflow ran: GitHub Actions tab
2. Check `build-and-push` job ran (not skipped)
3. Verify secrets are set correctly
4. Check Render webhook URLs are correct

### Backend Health Check Fails
**Symptom:** Backend shows unhealthy or 503 error

**Check:**
1. MongoDB connection string is correct
2. MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Environment variables set in Render dashboard
4. Check Render logs for MongoDB connection errors

### Frontend Can't Reach Backend
**Symptom:** Frontend loads but API requests fail

**Check:**
1. `NEXT_PUBLIC_API_BASE_URL` has correct backend URL
2. Backend CORS allows frontend domain
3. Both services are deployed and running
4. Check browser console for CORS errors

### Images Not Updating on Render
**Symptom:** Code changes pushed but old version still running

**Check:**
1. Verify workflow pushed to Docker Hub (check timestamps)
2. Manually trigger deploy: Render → Manual Deploy → Deploy latest reference
3. Check Render Events tab for deploy attempts
4. Webhook might have failed (check GitHub Actions logs)

## 🎯 Testing Deployment

### 1. Make a Small Change
```bash
# Update version in backend/src/index.ts
# Change version: "1.0.1" to "1.0.2"

git add backend/src/index.ts
git commit -m "feat: bump version to 1.0.2"
git push origin main
```

### 2. Watch GitHub Actions
- Go to Actions tab
- Watch workflow progress (takes ~7-10 minutes)

### 3. Verify on Render
- Check Events tab for new deployment
- Wait for deploy to complete (~2-5 minutes)

### 4. Test Live Application
```bash
# Check new version is deployed
curl https://dagboken-backend.onrender.com/health | jq .version
# Should show: "1.0.2"
```

## 📈 Deployment Timeline

| Step | Duration | Status Check |
|------|----------|--------------|
| GitHub Actions starts | Instant | Actions tab |
| Lint job | 1-2 min | ✅ |
| Docker tests | 3-5 min | ✅ |
| Build & push images | 3-5 min | Docker Hub timestamp |
| Trigger webhooks | Instant | GitHub Actions logs |
| Render deploys backend | 2-3 min | Render Events tab |
| Render deploys frontend | 3-5 min | Render Events tab |
| **Total** | **~10-15 min** | `/health` endpoint |

## 🔄 Rollback Procedure

If a deployment breaks production:

### Option 1: Quick Rollback (Render Dashboard)
1. Go to Render service
2. Click **"Manual Deploy"** → **"Deploy specific version"**
3. Select previous working commit SHA
4. Wait for deployment

### Option 2: Git Revert (Full Rollback)
```bash
# Revert the problematic commit
git revert <commit-sha>
git push origin main

# This triggers full CI/CD pipeline with reverted code
```

### Option 3: Deploy Previous Docker Image
```bash
# In Render service settings, manually change image tag:
# From: your-username/dagboken-backend:latest
# To:   your-username/dagboken-backend:<previous-commit-sha>
```

## 📝 Manual Deployment

To manually deploy without pushing to main:

### Trigger Workflow Manually
1. Go to GitHub → Actions tab
2. Select "Dagboken CI/CD" workflow
3. Click "Run workflow"
4. Select branch: `main`
5. Check "Run Docker integration tests"
6. Click "Run workflow"

### Deploy from Local Machine (Not Recommended)
```bash
# Build and push manually (bypasses CI/CD)
docker build -t your-username/dagboken-backend:latest ./backend
docker push your-username/dagboken-backend:latest

# Trigger Render webhook
curl -X POST "https://api.render.com/deploy/srv-xxxxx"
```

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)

---

**Questions or Issues?** Check the troubleshooting section or review GitHub Actions logs for detailed error messages.
