import { Station } from "../common/type/interface/station.ts";

const RAYON_TERRE = 6371;

export class FindByLocationProcess {

  public aroundPosition(stations: Station[], latitude: number, longitude: number, rayon: number, limit: number): Station[] {
    const stationsAround: Station[] = [];
    for (const station of stations) {
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
