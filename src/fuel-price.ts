import { getStationForID } from "./database.ts";
import { TypeCarburant } from "./type/type-carburant.ts";

export class FuelPrice {
  public getStation(id: string, _typeCarburant: TypeCarburant) {
    return getStationForID(id);
  }
}

// Total: 57000022
// Cora: 57160001
