import { Database } from "./database.ts";
import { Injectable } from "../deps.ts";
import { TypeCarburant } from "../type/type-carburant.ts";
import { Station } from "../type/interface/station.ts";

const RAYON_TERRE = 6371;

/**
 * StationService is responsible for the station data.
 */
@Injectable()
export class StationService {
  constructor(private database: Database) {}

  public async getPrice(_id: number, _typeCarburant: TypeCarburant) {
    const stations = await this.database.getStations();
    return stations.find((s) => s.id === _id)?.prix?.find((p) =>
      p.id_carburant === _typeCarburant
    )?.valeur;
  }

  public async aroundPosition(
    latitude: number,
    longitude: number,
    rayon: number,
    limit: number,
    carburant: TypeCarburant,
  ): Promise<Station[]> {
    const stations = await this.database.getStations();
    const stationsAround: Station[] = [];
    for (const station of stations) {
      if (carburant && !this.isStationPossedeCarburant(station, carburant)) {
        continue;
      }
      if (
        this.distance(
          station.latitude,
          station.longitude,
          latitude,
          longitude,
        ) <= rayon
      ) {
        stationsAround.push(station);
        limit--;
      }
      if (limit == 0) {
        break;
      }
    }
    return stationsAround;
  }

  private isStationPossedeCarburant(
    station: Station,
    carburant: TypeCarburant,
  ): boolean {
    return station.prix?.find((prix) => prix.id_carburant === carburant) !==
      undefined;
  }

  private distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);
    lon1 = lon1 * (Math.PI / 180);
    lon2 = lon2 * (Math.PI / 180);
    const a = this.hav(lat2, lat1) +
      Math.cos(lat1) * Math.cos(lat2) * this.hav(lon2, lon1);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RAYON_TERRE * c;
  }

  private hav(a: number, b: number): number {
    return Math.sin((a - b) / 2) ** 2;
  }
}
