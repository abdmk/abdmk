# Deployment Guide

This guide covers deploying the portfolio site to Netlify with automatic content syncing.

## Prerequisites

- GitHub account with the repository connected
- Netlify account (free tier works)

## Netlify Setup

### 1. Connect Repository

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub account
4. Select the `abdmk/abdmk` repository
5. Set branch to `claude/creative-portfolio-website-vbi6ub`

### 2. Configure Build Settings

Netlify will auto-detect the `netlify.toml` file. Verify:

- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 3. Set Environment Variables

In Netlify Site Settings → Environment:

```
ADMIN_PASSWORD=<strong-password-here>
ADMIN_SECRET=<generate-random-string-32-chars-minimum>
```

**Generating ADMIN_SECRET**: Use a tool like:
```bash
openssl rand -base64 32
```

Or paste 32+ random characters from your favorite random generator.

### 4. Deploy

Click "Deploy site". Netlify will:
1. Build the Next.js app
2. Publish the `.next` directory
3. Make site live at `<name>.netlify.app`

The first build takes ~2 minutes. Subsequent builds are faster.

## Content Management

### Editing Content Locally

Content is stored as JSON in `/content/`:

```
/content/
├── settings.json      # Site identity, About, contact details
├── categories.json    # Work taxonomy
├── projects.json      # Case studies
├── companies.json     # Clients/companies
├── fonts.json         # Typefaces
├── services.json      # Services offered
└── workshops.json     # Workshops and courses
```

To edit:

1. Edit the JSON files locally
2. Push to GitHub
3. Netlify automatically rebuilds and deploys

### Using the Admin CMS

Once deployed, the admin interface is at `https://<your-site>.netlify.app/admin`

**Login**: 
- Username: (not required)
- Password: Your `ADMIN_PASSWORD`

The CMS allows editing all content without touching JSON directly.

**Important**: When you save changes in the admin:

1. Content is written to the `/content/` files
2. Changes are automatically committed to GitHub
3. Netlify detects the push and redeploys
4. Your site updates in ~1-2 minutes

This happens automatically — no manual push needed.

## Contact Form

The contact form at `/[lang]/contact` collects inquiries. Currently it:

- Validates input and prevents spam (honeypot field)
- Logs submissions to server console
- Does NOT send emails yet

To enable email notifications, configure a mail provider:

### Option 1: Resend (Recommended)

1. Create account at [resend.com](https://resend.com)
2. Get your API key
3. Add to Netlify Environment: `RESEND_API_KEY=<your-key>`
4. Uncomment the Resend code in `src/app/api/contact/route.ts`

### Option 2: SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to Netlify Environment: `SENDGRID_API_KEY=<your-key>`

### Option 3: Other Providers

Modify `src/app/api/contact/route.ts` to use your preferred service.

## Monitoring Deploys

### Netlify Dashboard

- **Deploys**: Shows all builds, status, and logs
- **Build logs**: Click any deploy to see full build output
- **Preview deploys**: Each GitHub branch gets a preview URL

### Custom Domain

To use your own domain:

1. In Netlify Site Settings → Domain management
2. Add custom domain
3. Update DNS records (Netlify provides instructions)
4. SSL certificate auto-provisioned via Let's Encrypt

## Troubleshooting

### Admin CMS Not Editable

If the admin UI loads but saves don't work:

1. Check Netlify build logs for errors
2. Verify `ADMIN_PASSWORD` and `ADMIN_SECRET` are set
3. Clear browser cache and try login again

### Content Not Updating

If you edit content but site doesn't update:

1. Check Netlify "Deploys" tab for active build
2. If stuck, manually trigger rebuild: Netlify dashboard → Deploys → "Trigger deploy"
3. Check for git push errors in server logs

### Git Push Failures in Admin

On Netlify serverless, git operations are best-effort. If they fail:

1. Edit content locally as a fallback
2. Push manually to GitHub
3. Site rebuilds automatically

### Build Failures

If Netlify build fails:

1. Check build logs in Netlify dashboard
2. Verify all environment variables are set
3. Test locally: `npm run build` (must succeed)
4. Common issues:
   - Missing `ADMIN_PASSWORD` or `ADMIN_SECRET`
   - Corrupted JSON in `/content/`

## Performance

The site uses:

- **Static generation**: 87 pages pre-rendered at build time (~1-2 min)
- **ISR (Incremental Static Regeneration)**: Admin edits trigger revalidation
- **CDN**: Netlify's global CDN serves files from edge locations
- **Image optimization**: Next.js WebP/AVIF with automatic resizing

Expected performance:

- Time to First Byte (TTFB): < 100ms
- First Contentful Paint (FCP): < 1.5s
- Lighthouse Score: 90+

## Updating Typefaces

Typefaces are included as WOFF files under `/public/fonts/`:

- Graphik Arabic 200 (Light)
- Graphik Arabic 300 (Light)
- Graphik Arabic 400 (Regular)
- Graphik Arabic 500 (Medium)
- Graphik Arabic 600 (Semi-bold)

To change the default typeface:

1. Replace files in `/public/fonts/`
2. Update font declarations in `src/app/globals.css`
3. Push to GitHub
4. Site redeploys

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Test admin CMS locally
3. ✅ Set environment variables on Netlify
4. ✅ Make first deployment
5. ✅ Test admin CMS on production
6. ⬜ Configure custom domain
7. ⬜ Set up email for contact form
8. ⬜ Add analytics (Google Analytics, Plausible, etc.)

## Support

For issues:

1. Check Netlify build logs
2. Review this guide's Troubleshooting section
3. Check the repository README.md

---

**Site architecture**: Next.js 15 + TypeScript + Tailwind CSS, static generation + ISR, JSON file-based content, admin CMS with GitHub sync, bilingual (Arabic/English), WCAG 2.1 AA accessible.
