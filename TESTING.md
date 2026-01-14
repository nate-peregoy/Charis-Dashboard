# Testing Guide - Clerk Authentication

## 🧪 How to Test Your Dashboard

### Prerequisites:
- ✅ Dev server running (`npm run dev`)
- ✅ Clerk account with test keys configured

---

## Test Sequence:

### 1. **Test Homepage**
```
URL: http://localhost:4321
Expected: 
- ✅ See "Welcome to Your Dashboard" heading
- ✅ Two buttons: "Sign In" and "Sign Up"
- ✅ Tailwind styling applied
```

### 2. **Test Sign Up Flow**
```
Steps:
1. Click "Sign Up" button
2. You should see Clerk's sign-up form
3. Enter email and password
4. Complete registration
5. Should auto-redirect to /dashboard

Expected Results:
- ✅ Clerk sign-up UI loads
- ✅ Can create new account
- ✅ Redirects to dashboard after signup
- ✅ User is authenticated
```

### 3. **Test Dashboard Access (Authenticated)**
```
URL: http://localhost:4321/dashboard
Expected:
- ✅ Dashboard loads successfully
- ✅ Header with "Dashboard" title visible
- ✅ UserButton (avatar) in top-right corner
- ✅ Green success message: "Authentication Status: Logged In"
- ✅ Your User ID displayed
- ✅ Three dashboard cards (Profile, Analytics, Settings)
```

### 4. **Test Protected Route (Unauthenticated)**
```
Steps:
1. Sign out (click UserButton → Sign Out)
2. Try to visit: http://localhost:4321/dashboard

Expected Results:
- ✅ Automatically redirected to /sign-in
- ✅ Cannot access dashboard without auth
- ✅ Middleware protection working
```

### 5. **Test Sign In Flow**
```
Steps:
1. Visit http://localhost:4321/sign-in
2. Enter credentials from previous signup
3. Click sign in

Expected Results:
- ✅ Clerk sign-in UI loads
- ✅ Can log in with existing account
- ✅ Redirects to /dashboard after login
- ✅ User ID displayed correctly
```

### 6. **Test Sign Out**
```
Steps:
1. From dashboard, click UserButton (avatar)
2. Click "Sign Out"

Expected Results:
- ✅ Sign out menu appears
- ✅ Successfully logs out
- ✅ Redirects to homepage (/)
- ✅ Can no longer access /dashboard without re-authenticating
```

---

## 🔍 What to Check:

### Visual Elements:
- [ ] Tailwind CSS styles loading correctly
- [ ] Clerk UI components rendering properly
- [ ] Responsive layout working
- [ ] No console errors in browser

### Functionality:
- [ ] Sign up creates new user
- [ ] Sign in authenticates existing user
- [ ] Dashboard shows user ID
- [ ] UserButton works for sign out
- [ ] Middleware protects /dashboard routes
- [ ] Redirects work correctly

### Clerk Integration:
- [ ] Clerk publishable key working
- [ ] Clerk secret key authenticating
- [ ] User session persists
- [ ] Sign out clears session

---

## 🐛 Common Issues & Solutions:

### Issue: "Clerk keys not found"
**Solution**: Check `.env` file has correct keys:
```bash
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Issue: "Cannot access dashboard"
**Solution**: 
1. Make sure you're signed in
2. Check middleware.ts is configured
3. Verify Clerk integration in astro.config.mjs

### Issue: "Clerk UI not loading"
**Solution**:
1. Check browser console for errors
2. Verify @clerk/astro is installed
3. Restart dev server

### Issue: "Redirect loops"
**Solution**:
1. Check middleware configuration
2. Ensure afterSignInUrl is set correctly
3. Clear browser cache/cookies

---

## ✅ Success Criteria:

Your authentication is working correctly if:
1. ✅ You can create a new account
2. ✅ You can sign in with that account
3. ✅ Dashboard shows your user ID
4. ✅ You cannot access /dashboard when logged out
5. ✅ You can sign out successfully
6. ✅ You're redirected appropriately at each step

---

## 📊 Test Results Template:

```
Test Date: ___________
Test Environment: Development

[ ] Homepage loads correctly
[ ] Sign up flow works
[ ] Sign in flow works
[ ] Dashboard accessible when authenticated
[ ] Dashboard protected when not authenticated
[ ] User ID displays correctly
[ ] Sign out works
[ ] Redirects function properly
[ ] No console errors
[ ] UI renders correctly

Overall Status: PASS / FAIL
Notes: ___________________
```

---

## 🎯 Ready for Next Step?

Once all tests pass, you're ready to move to **Step 3: Enhance Dashboard** with:
- Additional pages (Profile, Settings)
- More user information display
- Enhanced UI/UX features
