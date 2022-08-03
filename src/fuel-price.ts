import { Database } from "bun:sqlite";
import { TypeCarburant } from "./type/type-carburant";

export class FuelPrice {
  public getStation(id: string, typeCarburant: TypeCarburant) {
    try {
      const db = new Database("fuel-price.db", { readonly: true });
      const query = db.query("SELECT * FROM station WHERE id = ?");
      return query.get(id);
    } catch (error) { 
      throw new Error("Error while getting station");
    }
  }
}

// Total: 57000022
// Cora: 57160001
