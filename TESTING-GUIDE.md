# Testing Guide - Step 2

## ✅ How to Test the Authentication Flow

### 1. Start the Development Server
```bash
cd /home/claude/dashboard-app
npm run dev
```

The server should start at `http://localhost:4321/`

### 2. Test Public Routes

**Homepage (`/`):**
- Visit `http://localhost:4321/`
- You should see:
  - "Welcome to Your Dashboard" heading
  - "Sign In" button (blue)
  - "Sign Up" button (gray)

**Sign In Page (`/sign-in`):**
- Click "Sign In" or visit `http://localhost:4321/sign-in`
- You should see:
  - "Sign in to your account" heading
  - Clerk authentication widget
  - Link to sign up page

**Sign Up Page (`/sign-up`):**
- Click "Sign Up" or visit `http://localhost:4321/sign-up`
- You should see:
  - "Create your account" heading
  - Clerk authentication widget
  - Link to sign in page

### 3. Test Protected Routes

**Dashboard (Protected):**
- Try visiting `http://localhost:4321/dashboard` without logging in
- **Expected behavior:** You should be automatically redirected to `/sign-in`

### 4. Test Complete Authentication Flow

1. **Sign Up:**
   - Go to `/sign-up`
   - Create a new account with email/password or social login
   - After successful signup, you should be redirected to `/dashboard`

2. **View Dashboard:**
   - You should see:
     - "Welcome to your Dashboard!" message
     - Green "Authentication Status: Logged In" box
     - Your User ID displayed
     - User profile button in the top right
     - Three sample dashboard cards

3. **Sign Out:**
   - Click the user button in the top right
   - Click "Sign out"
   - You should be redirected to the homepage

4. **Sign In Again:**
   - Go to `/sign-in`
   - Log in with your existing account
   - You should be redirected back to `/dashboard`

5. **Test Protected Route Again:**
   - Sign out
   - Try visiting `/dashboard` directly
   - You should be redirected to `/sign-in`

---

## ✅ Success Criteria

All of the following should work:
- [ ] Homepage loads with navigation buttons
- [ ] Sign-in page displays Clerk authentication widget
- [ ] Sign-up page displays Clerk authentication widget
- [ ] Cannot access `/dashboard` without authentication (redirects to sign-in)
- [ ] Can create a new account
- [ ] Redirected to dashboard after successful authentication
- [ ] Dashboard displays user information
- [ ] Can sign out using the UserButton
- [ ] Can sign back in with existing credentials

---

## 🐛 Troubleshooting

**If Clerk widget doesn't appear:**
- Check that `.env` file has the correct API keys
- Verify the keys start with `pk_test_` and `sk_test_`
- Restart the dev server

**If redirects don't work:**
- Check `src/middleware.ts` is in the correct location
- Verify the middleware is configured in `astro.config.mjs`

**If you see authentication errors:**
- Make sure your Clerk keys are valid
- Check that you're using test keys (not production)
- Visit Clerk dashboard to verify your application settings

---

## Next Steps

Once all tests pass, we'll move to Step 3 to enhance the dashboard UI!
