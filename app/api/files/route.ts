import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export default async function GET(request:NextRequest){
          try {
            const {userId}=await auth();
            if(!userId){
         return NextResponse.json({error:"unauthorized"},{status:400})}
          const {body} =await request.json();
        const {userId:bodyUserId,parent_id}=body;
         const SearchParams=request.nextUrl.searchParams;
         const queryuserid=SearchParams.get(userId);
         const parentid=SearchParams.get(parent_id);
         if(! queryuserid || queryuserid !== userId){
             return NextResponse.json({error:" userid required"},{status:400})
         }
         let filedata
         if(parentid){
            const [filedata]=await db.select().from(files).where(
                and(
                    eq(files.id,parentid),
                    eq(files.userId,userId)
                )
            )
         }
         else{
           const [filedata]=await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    isNull(files.parentid)
                )
            )
         }
         return NextResponse.json(filedata);
          } catch (error) {
                 return NextResponse.json({error:" Error fetching  files"},{status:400})
          }
}