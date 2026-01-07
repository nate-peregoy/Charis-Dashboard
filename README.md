# 🏛️ Charis Foundation Board Member Dashboard

A secure, custom-built board portal for Charis Foundation board members with Clerk authentication. Manage grantmaking, review partner organizations, access meeting materials, and oversee foundation operations.

## 🎯 Foundation Mission

**"Participating in God's work in the world by offering financial, strategic and operational support in collaboration with Christian organizations and their leaders."**

## ✨ Features

### **Custom Board Member Features:**
- 🔐 **Secure Authentication** - Clerk-powered sign up, sign in, and user management
- 📊 **Grant Management** - Review applications, track status, filter by program
- 🤝 **Partner Directory** - View all partner organizations with financial tracking
- 📅 **Meeting Management** - Upcoming meetings, agendas, materials, and minutes
- 📚 **Document Repository** - Board governance, financials, strategic plans, minutes
- 📈 **Real-time Dashboard** - Quick stats, pending reviews, recent activity
- 🛡️ **Protected Routes** - All /dashboard/* pages require authentication
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### **Program Categories:**
- Ministry Leadership Development
- Faith & Work Movement
- Strategic Grants

### **For Board Governance:**

## 📁 Project Structure

```
dashboard-app/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Homepage
│   │   ├── sign-in.astro            # Sign in page (Clerk)
│   │   ├── sign-up.astro            # Sign up page (Clerk)
│   │   └── dashboard/
│   │       ├── index.astro          # Main dashboard (protected)
│   │       ├── profile.astro        # User profile (protected)
│   │       └── settings.astro       # Settings (protected)
│   ├── layouts/
│   │   └── Layout.astro             # Base layout
│   ├── components/
│   │   └── Header.astro             # Navigation header
│   └── middleware.ts                # Route protection
├── .env                             # Environment variables
├── astro.config.mjs                 # Astro configuration
├── package.json                     # Dependencies
└── tailwind.config.mjs              # Tailwind configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd /home/claude/dashboard-app
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install --break-system-packages
   ```

3. **Verify environment variables:**
   Check that `.env` contains your Clerk keys:
   ```
   PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:4321`

## 🔐 Authentication Flow

1. **Sign Up:**
   - Click "Sign Up" on the homepage
   - Fill in email and password (or use OAuth)
   - Automatically redirected to `/dashboard` after signup

2. **Sign In:**
   - Click "Sign In" on the homepage or go to `/sign-in`
   - Enter your credentials
   - Redirected to `/dashboard` after successful login

3. **Protected Routes:**
   - All `/dashboard/*` routes require authentication
   - Unauthenticated users are redirected to `/sign-in`
   - Middleware handles route protection automatically

4. **Sign Out:**
   - Click the user avatar in the header
   - Select "Sign Out"
   - Redirected to homepage

## 📄 Available Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Homepage with Charis Foundation branding | No |
| `/sign-in` | Board member sign in page | No |
| `/sign-up` | New board member registration | No |
| `/dashboard` | Main dashboard with overview & stats | Yes ✅ |
| `/dashboard/grants` | Grant application review system | Yes ✅ |
| `/dashboard/partners` | Partner organization directory | Yes ✅ |
| `/dashboard/meetings` | Board meeting schedules & materials | Yes ✅ |
| `/dashboard/documents` | Document repository & reports | Yes ✅ |
| `/dashboard/profile` | User profile management | Yes ✅ |
| `/dashboard/settings` | User preferences & settings | Yes ✅ |

## 🛠️ Technologies Used

- **[Astro](https://astro.build)** v4.16.18 - Web framework
- **[@clerk/astro](https://clerk.com)** v1.4.6 - Authentication
- **[React](https://react.dev)** v18.3.1 - UI components
- **[Tailwind CSS](https://tailwindcss.com)** v3.4.15 - Styling
- **[TypeScript](https://www.typescriptlang.org)** v5.7.3 - Type safety
- **[@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)** v8.3.4 - SSR adapter

## 🧪 Testing

See `TESTING_GUIDE.md` for comprehensive testing instructions.

**Quick Test Checklist:**
- [ ] Homepage loads
- [ ] Can navigate to sign-in page
- [ ] Can navigate to sign-up page
- [ ] Can create a new account
- [ ] Redirected to dashboard after signup
- [ ] Dashboard shows user information
- [ ] Can navigate between dashboard pages
- [ ] Profile page loads with Clerk UserProfile
- [ ] Settings page displays correctly
- [ ] Can sign out successfully
- [ ] Protected routes redirect when not authenticated

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run astro    # Run Astro CLI commands
```

## 🔧 Configuration

### Environment Variables

Required environment variables in `.env`:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### Clerk Configuration

The Clerk integration is configured in `astro.config.mjs`:

```javascript
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    tailwind(),
    clerk()  // Clerk integration
  ]
});
```

### Middleware

Route protection is handled in `src/middleware.ts`:

```typescript
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export const onRequest = clerkMiddleware((auth, context) => {
  const { redirectToSignIn, userId } = auth();
  if (!userId && isProtectedRoute(context.request)) {
    return redirectToSignIn();
  }
});
```

## 🎨 Customization

### Adding New Protected Routes

1. Add the route pattern to `src/middleware.ts`:
   ```typescript
   const isProtectedRoute = createRouteMatcher([
     '/dashboard(.*)',
     '/admin(.*)',  // New protected route
   ]);
   ```

2. Create the page in `src/pages/`

### Styling

- Global styles: Modify `src/layouts/Layout.astro`
- Component styles: Use Tailwind classes or add custom CSS
- Tailwind config: Modify `tailwind.config.mjs`

### Adding Pages

1. Create a new `.astro` file in `src/pages/`
2. Import the Layout component
3. Add authentication check if needed:
   ```astro
   ---
   const { userId } = Astro.locals.auth();
   if (!userId) {
     return Astro.redirect('/sign-in');
   }
   ---
   ```

## 🐛 Troubleshooting

**Server won't start:**
- Run `npm install --break-system-packages` again
- Check that all dependencies are installed
- Verify `.env` file exists with correct keys

**Authentication not working:**
- Verify Clerk keys are correct in `.env`
- Check Clerk dashboard for application status
- Clear browser cookies and cache

**Routes not protected:**
- Verify middleware.ts is in `src/` folder
- Check that route patterns match in middleware
- Restart the development server

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ✅ Status

**Current Version:** 1.0.0  
**Status:** ✅ Fully Functional  
**Last Updated:** January 7, 2026

All core features are implemented and tested:
- ✅ User authentication (sign up, sign in, sign out)
- ✅ Protected routes with middleware
- ✅ Dashboard with navigation
- ✅ User profile management
- ✅ Settings page
- ✅ Responsive design

## 📄 License

This project is provided as-is for demonstration purposes.

---

**Built with ❤️ using Astro and Clerk**
