import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { upload } from "@imagekit/next";
import { and, eq } from "drizzle-orm";
import { uuid } from "drizzle-orm/gel-core";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { arrayBuffer } from "stream/consumers";
import { v4 } from "uuid";

const imagekit=new ImageKit({
       privateKey:process.env.IMAGEKIT_PRIVATE_KEY||"" ,
       publicKey: process.env.IMAGEKIT_PUBLIC_KEY ||"",
       urlEndpoint:process.env.IMAGEKIT_END_URL||""
});
export default  async function POST(request:NextRequest){
      try {
         const {userId}=await auth();
                    if(!userId){
                 return NextResponse.json({error:"unauthorized"},{status:400})}

        const formData= await request.formData();
        const file=formData.get("file") as File;
        const formUserId=formData.get("userId") as string;
        const parentid=formData.get("parent_id") as string || null;
        if(userId!==formUserId){
              return NextResponse.json({error:"unauthorized"},{status:400})
            }
        if(!file){
             return NextResponse.json({error:"no file exists"},{status:400})
        }
       if(parentid){
      const [parentfolder]=await db.select().from(files)
      .where(
         and(
            eq(files.id,parentid),
            eq(files.user_id,userId),
            eq(files.isFolder,true)
         )
      )
    }
     if(!parentid){
         return NextResponse.json({error:"not a parent folder exists"},{status:400})
      }
      if(! file.type.startsWith("image/") && file.type !=="application/pdf"){
          return NextResponse.json({error:"images and pdf are allowed"},{status:400})
      }
      const buffer=await file.arrayBuffer();
      const fileBuffer=Buffer.from(buffer);
      const folderpath=parentid?`/droply/${userId}/folder/${parentid}`:`/droply/${userId}`;
      const orignalname =file.name;
      const fileExtension=orignalname.split(".").pop()||"";
      const uniquFilename =`${v4()}.${fileExtension}`
    const uploadResponse=  await imagekit.upload({
        file:fileBuffer,
        fileName:uniquFilename,
        folder:folderpath,
        useUniqueFileName:false
      })
      const fileData={
        name:orignalname,
        path:uploadResponse.filePath,
       size:file.size,
       type:file.type,
       fileUrl:uploadResponse.url,
       thumbnailUrl:uploadResponse.thumbnailUrl || null,
      user_id:userId,
     parent_id:parentid,
    isFolder:false,
    isStarred:false,
    isTrash:false
      }
        const [newfile]=  await db.insert(files).values(fileData).returning();
        
      } catch (error) {
        
      }
}