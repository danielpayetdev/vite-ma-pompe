import { Injectable } from "../deps.ts";
import { Station } from "../type/interface/station.ts";

const DB_EXPIRATION_TIME_MS = 600000; // 10 minutes

interface StoreDBData {
  stations: Station[];
  lastUpdate: Date;
}

@Injectable({
  isSingleton: true
})
export class Database {
  private inMemoryData?: StoreDBData;

  public async saveStations(stations?: Station[]): Promise<void> {
    if (stations) {
      this.inMemoryData = {
        stations: stations,
        lastUpdate: new Date(),
      };
      await Deno.writeFile("db.json", new TextEncoder().encode(JSON.stringify(this.inMemoryData)));
    }
  }

  public async getStations(): Promise<Station[]> {
    return this.inMemoryData?.stations ?? (await this.getDB()).stations;
  }

  public async isDataBaseOutdated(): Promise<boolean> {
    try {
      await Deno.lstat("db.json");
      // const dbDate = new Date((await this.getDB()).lastUpdate);
      // if (dbDate.getTime() + DB_EXPIRATION_TIME_MS < new Date().getTime()) {
      //   throw new Error("Database is outdated");
      // }
      console.log("Database is up to date");
      return false;
    } catch (_) {
      return true;
    }
  }

  private async getDB(): Promise<StoreDBData> {
    try {
      const db = await Deno.readFile("db.json");
      const data = JSON.parse(new TextDecoder().decode(db));
      this.inMemoryData = data;
      return data;
    } catch (_) {
      return { stations: [], lastUpdate: new Date() };
    }
  }
}
