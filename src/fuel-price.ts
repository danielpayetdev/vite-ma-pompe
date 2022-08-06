import { getStations } from "./database.ts";
import { TypeCarburant } from "./type/type-carburant.ts";

export class FuelPrice {
  public async getPrice(_id: number, _typeCarburant: TypeCarburant) {
    const db = await getStations();
    return db.find((s) => s.id === _id)?.prix?.find((p) => p.id_carburant === _typeCarburant)?.valeur;
  }
}