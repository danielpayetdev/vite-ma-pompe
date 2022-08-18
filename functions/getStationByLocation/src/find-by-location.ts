import { Station } from "./type/station.ts";
import { TypeCarburant } from "./type/type-carburant.ts";

const RAYON_TERRE = 6371;

export class FindByLocationProcess {

    constructor(private database: sdk.Database) {}

  public aroundPosition(stations: string[], latitude: number, longitude: number, rayon: number, limit: number, carburant: TypeCarburant): Station[] {
    const stations = await Promise.all(stationsID.map((station) => database.getDocument(COLLECTION_STATION, station)));
    const stationsAround: Station[] = [];
    for (const station of stations) {
      if (carburant && !this.isStationPossedeCarburant(station, carburant)) {
        continue;
      }
      if (this.distance(station.latitude, station.longitude, latitude, longitude) <= rayon) {
        stationsAround.push(station);
        limit--;
      }
      if (limit == 0) {
        break;
      }
    }
    return stationsAround;
  }

  private isStationPossedeCarburant(station: Station, carburant: TypeCarburant): boolean {
    return station.prix?.find((prix) => prix.id_carburant === carburant) !== undefined;
  }

  private distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);
    lon1 = lon1 * (Math.PI / 180);
    lon2 = lon2 * (Math.PI / 180);
    const a = this.hav(lat2, lat1) + Math.cos(lat1) * Math.cos(lat2) * this.hav(lon2, lon1);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RAYON_TERRE * c;
  }

  private hav(a: number, b: number): number {
    return Math.sin((a - b) / 2) ** 2;
  }
}
