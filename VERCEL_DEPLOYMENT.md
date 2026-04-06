# Vercel Deployment Configuration

## Environment Variables Required

Add these to your Vercel project settings:

```
DATABASE_URL=postgresql://neondb_owner:npg_e78PLjzMHtNE@ep-winter-wind-agn2tdh1-pooler.c-2.eu-central-1.aws.neon.tech/neondb
OPENROUTER_API_KEY=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
```

## Deployment Steps

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables above
4. Deploy

## Build Settings (Auto-detected)

- Framework: Next.js
- Build Command: `prisma generate && next build`
- Output Directory: `.next`
- Install Command: `npm install`

## Post-Deployment

After first deployment:
1. Visit your-domain.vercel.app/admin
2. Login with your admin credentials
3. Change password to enable bcrypt encryption
4. Test all features

## Important Notes

- Database migrations are already applied
- Prisma Client will be generated during build
- All API routes will work automatically
- Static pages will be pre-rendered
- Dynamic routes will use SSR

## Troubleshooting

If build fails:
1. Check environment variables are set
2. Ensure DATABASE_URL is accessible from Vercel
3. Check build logs for specific errors

If admin page doesn't work:
1. Clear browser cache
2. Check browser console for errors
3. Verify middleware is not blocking routes
