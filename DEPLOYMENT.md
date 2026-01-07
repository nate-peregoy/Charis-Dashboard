# 🚀 Deployment Guide - Charis Foundation Dashboard

## Prerequisites

- Node.js 18+ installed
- Clerk account (free tier works)
- GitHub account
- Deployment platform account (Vercel, Netlify, or similar)

---

## 📋 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/charis-foundation-dashboard.git
cd charis-foundation-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or use existing)
3. Copy your API keys

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Clerk keys
nano .env  # or use your preferred editor
```

Add your keys:
```
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 5. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:4321

---

## 🌐 Deploy to Production

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add Environment Variables:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add both Clerk keys

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the site:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables:**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add both Clerk keys

### Option 3: Any Node.js Host

1. **Build:**
   ```bash
   npm run build
   ```

2. **Run:**
   ```bash
   node dist/server/entry.mjs
   ```

3. **Environment Variables:**
   - Set `PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in your hosting environment

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] `.env` file is in `.gitignore` (already done)
- [ ] Environment variables set in hosting platform
- [ ] Clerk keys are for production (not test keys)
- [ ] HTTPS is enabled on your domain
- [ ] Clerk application settings reviewed
- [ ] Test authentication flow in production

---

## 🔧 Configuration

### Clerk Settings

In your Clerk dashboard:

1. **Set up your production domain:**
   - Go to Settings → Domains
   - Add your production URL

2. **Configure session settings:**
   - Settings → Sessions
   - Set session lifetime as needed

3. **Customize sign-in/sign-up pages:**
   - Customize → Sign In/Sign Up
   - Match Charis Foundation branding

### Astro Configuration

The dashboard uses:
- SSR mode with Node adapter
- React integration for Clerk components
- Tailwind CSS for styling

To modify, edit `astro.config.mjs`

---

## 📊 Data Integration

Currently, the dashboard uses mock data. To connect real data:

### Option 1: Airtable (Easiest)
The project includes Airtable MCP integration:

```typescript
// Example: Fetch grants from Airtable
const grants = await airtable.list_records({
  baseId: 'your_base_id',
  tableId: 'your_table_id'
});
```

### Option 2: PostgreSQL
1. Install Prisma: `npm install prisma @prisma/client`
2. Set up your schema
3. Update pages to fetch from database

### Option 3: API Integration
Replace mock data with API calls in each page

---

## 🧪 Testing

### Local Testing

```bash
# Run development server
npm run dev

# Build and preview production
npm run build
npm run preview
```

### Test Checklist

- [ ] Sign up new user works
- [ ] Sign in existing user works
- [ ] All dashboard pages load
- [ ] Navigation works correctly
- [ ] Sign out works
- [ ] Mobile responsive design works

---

## 📝 Maintenance

### Updating Dependencies

```bash
npm update
```

### Updating Astro

```bash
npm install astro@latest
```

### Updating Clerk

```bash
npm install @clerk/astro@latest
```

---

## 🐛 Troubleshooting

### Issue: Clerk authentication not working
**Solution:** 
- Check environment variables are set correctly
- Verify Clerk keys are for the right environment (development/production)
- Check Clerk dashboard for application status

### Issue: Build fails
**Solution:**
- Delete `node_modules` and run `npm install` again
- Clear `.astro` folder: `rm -rf .astro`
- Check Node.js version: `node --version` (need 18+)

### Issue: Pages not loading
**Solution:**
- Check browser console for errors
- Verify all routes in `src/pages/` are correct
- Restart development server

---

## 📞 Support

For issues specific to:
- **Astro:** https://docs.astro.build
- **Clerk:** https://clerk.com/docs
- **This Dashboard:** Open an issue on GitHub

---

## 🔄 Updates & Changelog

Document your changes:

```markdown
## [1.1.0] - 2026-01-XX
### Added
- Database integration
- Email notifications

### Changed
- Updated UI design

### Fixed
- Authentication bug
```

---

## 📦 Backup Strategy

Recommended backups:
1. **Code:** GitHub repository (automatic)
2. **Environment Variables:** Store securely (1Password, etc.)
3. **Data:** Database backup strategy if using external DB

---

## ✅ Production Ready Checklist

Before going live:

- [ ] All environment variables configured
- [ ] HTTPS enabled
- [ ] Clerk production keys installed
- [ ] Test authentication flow
- [ ] Test all dashboard pages
- [ ] Mobile testing complete
- [ ] Board members can access
- [ ] Backup strategy in place
- [ ] Monitoring set up (optional)

---

*For Charis Foundation board members: Contact IT support if you need access credentials.*
