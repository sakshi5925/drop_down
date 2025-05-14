import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


import { NextResponse } from 'next/server';
const isPublicRoutes=createRouteMatcher(['/','/signin(.*)','/signup(.*)']);
export default clerkMiddleware(async(auth,req)=>{
  const user=auth();
  const userId = (await (user)).userId
  const url= new URL(req.url);
  const pathname=url.pathname;
  if(userId && isPublicRoutes(req) && pathname!=="/"){
      NextResponse.redirect(new URL("/dashboard",req.url))
  }
    if (!isPublicRoutes(req)){
        await auth.protect()
    }

})