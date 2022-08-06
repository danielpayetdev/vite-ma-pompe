import { Station } from "./type/interface/station.ts";

interface StoreDBData {
  stations: Station[];
  lastUpdate: Date;
}

export async function initDB(stations: Station[]): Promise<void> {
  await Deno.writeFile(
    "db.json",
    new TextEncoder().encode(
      JSON.stringify({
        stations: stations,
        lastUpdate: new Date(),
      })
    )
  );
}

export async function getStations(): Promise<Station[]> {
  return (await getDB()).stations;
}

export async function getDB(): Promise<StoreDBData> {
  const db = await Deno.readFile("db.json");
  return JSON.parse(new TextDecoder().decode(db));
}

const DB_EXPIRATION_TIME_MS = 600000; // 10 minutes

export async function isDataBaseOutdated(): Promise<boolean> {
  try {
    await Deno.lstat("db.json");
    const dbDate = new Date((await getDB()).lastUpdate);
    if (dbDate.getTime() + DB_EXPIRATION_TIME_MS < new Date().getTime()) {
      throw new Error("Database is outdated");
    }
    return false;
  } catch (_) {
    return true;
  }
}
