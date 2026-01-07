import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define which routes should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export const onRequest = clerkMiddleware((auth, context) => {
  const { redirectToSignIn, userId } = auth();
  
  // If the user is not signed in and the route is protected, redirect to sign-in
  if (!userId && isProtectedRoute(context.request)) {
    return redirectToSignIn();
  }
});
