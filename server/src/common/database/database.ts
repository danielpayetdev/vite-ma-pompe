import { Pool } from "https://deno.land/x/postgres@v0.16.1/mod.ts";

export const connect = async () => {
  try {
    const pgPool = new Pool({
      hostname: Deno.env.get("POSTGRES_HOSTNAME"),
      database: Deno.env.get("POSTGRES_DB"),
      user: Deno.env.get("POSTGRES_USER"),
      password: Deno.env.get("POSTGRES_PASSWORD"),
    }, 1);
    return await pgPool.connect();
  } catch (e) {
    console.error(e.message);
    Deno.exit();
  }
};
