import { auth } from '@clerk/nextjs/server';
import { Image } from '@imagekit/next';
import { error } from 'console';
import { NextResponse } from 'next/server';
import { getUploadAuthParams } from "@imagekit/next/server"
import ImageKit from "imagekit";


const imagekit=new ImageKit({
       privateKey:process.env.IMAGEKIT_PRIVATE_KEY||"" ,
       publicKey: process.env.IMAGEKIT_PUBLIC_KEY ||"",
       urlEndpoint:process.env.IMAGEKIT_END_URL||""
});
export async function Get(){
    try {
         const userId= await auth();
    if(!userId){
      return NextResponse.json({error:"unauthorized"},{status:400})

    }
    const authparams=imagekit.getAuthenticationParameters()
    return NextResponse.json(authparams)

    } catch (error) {
        return NextResponse.json({error},{status:402})
    }
   
}