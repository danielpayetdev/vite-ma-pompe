import { Pool } from "https://deno.land/x/postgres@v0.16.1/mod.ts";

// deno-lint-ignore no-explicit-any
export const connect = async (req: any, res: { send: (msg: string, code: number) => void }) => {
  try {
    const pgPool = new Pool({
      hostname: "appwrite-postgres",
      database: "stations",
      user: req.env["PG_USER"],
      password: req.env["PG_PASSWORD"],
    }, 1);
    return await pgPool.connect();
  } catch (e) {
    console.error(e.message);
    res.send("Error while saving data: " + e.message, 500);
    return undefined;
  }
};
