import { clerkMiddleware } from '@clerk/nextjs/server';

const middleware = clerkMiddleware((auth, req) => {
  console.log("✅ Clerk middleware triggered on:", req.nextUrl.pathname);
});

export default middleware;

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // Match everything except static files and Next internals
  ],
};