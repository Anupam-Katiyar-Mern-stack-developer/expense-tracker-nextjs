import { Pool } from "pg";


const  connectionString =process.env.DATABASE_URL;

if(!connectionString){
    throw new Error("DATABASE _url is missing in .env.loacal");
}

const globalForpg =globalThis;

const pool=globalForpg.pgPool ??
   new  Pool({
    connectionString,
   });

   if(process.env.NODE_ENV !== 'production'){
    globalForpg.pgPool =pool;
   }

   export default pool;