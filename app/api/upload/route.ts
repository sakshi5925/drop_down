import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){
 try {
    const userId= await auth();
    if(!userId){
      return NextResponse.json({error:"unauthorized"},{status:400})

    }
    const {body} =await request.json();
   const {imagekit,userId:bodyUserId}=body;
   if(userId!=bodyUserId){
      return NextResponse.json({error:"unauthorized user"},{status:400})
   }
   if(!imagekit ||!imagekit.url){
      return NextResponse.json({error:"not contain any data"},{status:500})
   }
  const filedata={
    name:imagekit.name,
    path:imagekit.path,
    size:imagekit.size,
    type:imagekit.type,
    fileUrl:imagekit.fileUrl,
    thumbnailUrl:imagekit.thumbnailUrl,
    user_id:imagekit.user_id,
    parent_id:null,
    isFolder:false,
    isStarred:false,
    isTrash:false
  }

  const [newfile]=  await db.insert(files).values(filedata).returning();
   return NextResponse.json(newfile)
  
    } catch (error) {
        return NextResponse.json({error},{status:402})
    }
}