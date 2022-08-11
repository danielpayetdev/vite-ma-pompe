import { Database } from "./database.ts";
import { Injectable } from "../deps.ts";
import { TypeCarburant } from "../type/type-carburant.ts";

@Injectable()
export class StationService {
  constructor(private database: Database) {}

  public async getPrice(_id: number, _typeCarburant: TypeCarburant) {
    const db = await this.database.getStations();
    return db.find((s) => s.id === _id)?.prix?.find((p) => p.id_carburant === _typeCarburant)?.valeur;
  }
}
