import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless"
import * as dotenv from "dotenv"
dotenv.config({path:".env.local"});
if(!process.env.DATABASE_URL){
    throw   new Error("database url not set in .env.local");
}
async function runMigration(){
    try {
        const sql=neon(process.env.DATABASE_URL||"")
        const db=drizzle(sql)
        await migrate(db,{migrationsFolder:"./drizzle"})
        console.log("all migration sucessfully done")
    } catch (error) {
         console.log("fail to  migration")
         process.exit(1)
    }
}
runMigration()