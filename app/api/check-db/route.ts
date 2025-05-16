// app/api/check-db/route.ts
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
// import { db } from '@/lib/db/index.ts';
// import { files } from '../../../lib/db/schema.ts' // Replace with an actual table from your schema
export async function GET() {
  
  try {
    
    const result = await db.select().from(files).limit(1); // Small test query
    console.log("result",result)
    return NextResponse.json({
      success: true,
      message: "DB connected successfully",
      data: result
    });
  } catch (error:any) {
    return NextResponse.json({
      success: false,
      message: "DB connection failed",
      error: error.message
    }, { status: 500 });
  }
}