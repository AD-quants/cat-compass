# CAT Compass

A free, provider-independent CAT exam preparation companion that turns fragmented practice data into a prioritised, actionable study plan.

## What it does

- **Preparation logger**: Record questions from any coaching platform
- **Unified history**: Filter and search across all logged practice
- **Next Steps**: AI-like weakness ranking with explained recommendations
- **Reattempt tracker**: Track whether you've actually improved
- **Import/Export**: CSV-based data portability

## Prerequisites

- Node.js 18 or later
- npm (comes with Node.js)
- Git

## Local Setup

```bash
git clone <your-repo-url>
cd cat-compass
npm install
npm run dev
```

Open http://localhost:3000

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CAT Compass"
git branch -M main
git remote add origin https://github.com/<your-username>/cat-compass.git
git push -u origin main
```

## Deploy to Netlify

### Step 1: Create a Netlify account
Go to https://netlify.com and sign up.

### Step 2: Connect your GitHub repository
1. Click **Add new site** → **Import an existing project**
2. Choose **GitHub** as your Git provider
3. Authorize Netlify to access your GitHub account
4. Select the `cat-compass` repository

### Step 3: Configure build settings
Netlify will auto-detect the settings from `netlify.toml`. Verify:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: Set to `18` in Site settings → Environment → NODE_VERSION = `18`

### Step 4: Deploy
Click **Deploy site**. Your site will be live in ~2 minutes.

## Environment Variables

None required. The app uses browser localStorage only.

## Subsequent Deployments

Push to the `main` branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will automatically detect the push and redeploy.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- localStorage for data persistence
- Netlify + @netlify/plugin-nextjs for deployment
