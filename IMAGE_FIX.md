# Image Configuration for Vercel

## Problem
Images not loading on Vercel deployment.

## Solution

### 1. Use Next.js Image Component
Replace all `<img>` tags with `<Image>` from `next/image` for optimization.

### 2. Image Paths
All images in `/public` folder are accessible at root:
- `/public/logo.svg` → `/logo.svg`
- `/public/images/hero.png` → `/images/hero.png`

### 3. Remote Images
For uploaded blog images, they're stored in `/public/uploads/blog/`

### 4. Default Images Created
- ✅ `/public/images/default-blog.svg` - Default blog image
- ✅ `/public/logo.png` - Logo placeholder

### 5. Vercel Configuration
`next.config.ts` already configured to allow all remote images.

## Quick Fix

If images still don't load on Vercel:

1. **Check Build Logs**
   - Ensure `/public` folder is included in deployment

2. **Clear Cache**
   - In Vercel dashboard: Settings → Clear Cache → Redeploy

3. **Check Image Paths**
   - All paths should start with `/` (e.g., `/images/hero.png`)
   - No `public/` prefix needed

4. **Verify Files Exist**
   ```bash
   ls -la public/images/
   ```

## Images Status

✅ Logo: `/logo.svg` and `/logo.png`
✅ Hero: `/images/hero.png`
✅ About: `/images/about.png`
✅ Projects: `/images/project1.png`, `/images/project2.png`, `/images/project3.png`
✅ Default Blog: `/images/default-blog.svg`

## Next Steps

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Fix images and add placeholders"
   git push origin main
   ```

2. Vercel will auto-deploy

3. Images should load correctly now!
