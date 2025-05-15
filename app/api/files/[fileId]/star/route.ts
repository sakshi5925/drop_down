import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export default async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ fileId: string }> }

) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "unauthorized" }, { status: 400 })
        }
        const { fileId } = await props.params;
        if (!fileId) {
            return NextResponse.json({ error: "invalid file id" }, { status: 400 })
        }
        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId)
            )
        )

        if (!file) {
            return NextResponse.json({ error: "file not exist" }, { status: 400 })

        }

      const [updatedfiles]= await db.update(files).set({isStarred:! file.isStarred}).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId)
            )
        ).returning();

    const updatefile=updatedfiles[0];
    return NextResponse.json(updatefile);
    } catch (error) {
       return NextResponse.json({ error: "failed to update the file" }, { status: 500 })
    }

}