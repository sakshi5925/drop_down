import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import {and , eq} from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";

import {v4} from "uuid"

export  async function POST(request:NextRequest){
    try {
         const {userId}= await auth();
            if(!userId){
              return NextResponse.json({error:"unauthorized"},{status:400})
            }
            const {body} =await request.json();
            const {name,userId:bodyUserId,parent_id}=body;
         if(userId!==bodyUserId){
      return NextResponse.json({error:"unauthorized user"},{status:400})
      }
      if(!name || typeof name!=="string" || name.trim()===""){
         return NextResponse.json({error:"folder name  required"},{status:400})
      }
      if(parent_id){
      const [parentfolder]=await db.select().from(files)
      .where(
         and(
            eq(files.id,parent_id),
            eq(files.user_id,userId),
            eq(files.isFolder,true)
         )
      )
      if(!parentfolder){
         return NextResponse.json({error:"not a parent folder exists"},{status:400})
      }

    }
    const folderdata={
    id:v4(),
    name:name,
    path:'/folder/${userId}/${id}',
    size:0,
    type:"folder",
    fileUrl:"",
    thumbnailUrl:"",
    user_id:userId,
    parent_id:parent_id,
    isFolder:true,
    isStarred:false,
    isTrash:false
    }
      const [newfolder]=  await db.insert(files).values(folderdata).returning();
   return NextResponse.json({
      success:true,
      message:"folder created successfully",
      folder:newfolder
   })
        
    } catch (error) {
           return NextResponse.json({error},{status:402})
    }
}