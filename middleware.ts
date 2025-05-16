import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


import { NextResponse } from 'next/server';
const isPublicRoutes=createRouteMatcher(['/','/signin(.*)','/signup(.*)']);
export default clerkMiddleware(async(auth,req)=>{
  const user=auth();
  const userId = (await (user)).userId
  const url= new URL(req.url);
  const pathname=url.pathname;
  console.log("UserId:", userId);
  console.log("Pathname:", pathname);
  console.log("Is Public Route:", isPublicRoutes(req));
  if(userId && isPublicRoutes(req) && pathname!=="/"){
      console.log("Redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard",req.url))
  }
    if (!isPublicRoutes(req)){
        await auth.protect()
    }

})