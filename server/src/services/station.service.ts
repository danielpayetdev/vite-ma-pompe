import { Database } from "./database.ts";
import { Injectable } from "../deps.ts";
import { TypeCarburant } from "../type/type-carburant.ts";
import { Station } from "../type/interface/station.ts";

@Injectable()
export class StationService {
  constructor(private database: Database) {}

  public async getPrice(_id: number, _typeCarburant: TypeCarburant) {
    const stations = await this.database.getStations();
    return stations.find((s) => s.id === _id)?.prix?.find((p) => p.id_carburant === _typeCarburant)?.valeur;
  }

  public async aroundPosition(latitude: number, longitude: number, rayon: number, limit: number): Promise<Station[]> {
    const stations = await this.database.getStations();
    console.time("aroundPosition");
    const stationsAround = stations.filter((s) => {
      return this.distance(s.latitude /10000, s.longitude / 10000, latitude, longitude) <= rayon;
    });
    console.timeEnd("aroundPosition");
    return limit ? stationsAround.slice(0, limit) : stationsAround;
  }

  private distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const a = Math.sin((lat2 - lat1) / 2) **2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin((lon2 - lon1) / 2) **2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = 6371 * c;
    return d;
  }
}
