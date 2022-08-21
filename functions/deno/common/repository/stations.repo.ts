import { Station } from "../../common/type/interface/station.ts";

export class StationsRepo {
  private static TABLE = "station";
  private static COLUMNS = [
    "id",
    "latitude",
    "longitude",
    "cp",
    "pop",
    "adresse",
    "ville",
    "horaires",
    "prix",
  ];

  public static insertAll(stations: Station[]): string {
    return `
        INSERT INTO ${StationsRepo.TABLE} (${StationsRepo.COLUMNS.join(",")})
        VALUES
            ${
      stations.map((s) => StationsRepo.getInsertValueString(s)).join(",")
    }
        RETURNING _id;
        `;
  }

  public static deleteAll(stations: number[]): string {
    return `DELETE FROM ${StationsRepo.TABLE} WHERE _id NOT IN (${
      stations.join(",")
    })`;
  }

  public static getFuelPriceofStation(id: number, fuel: number): string {
    return `
      SELECT elem->'valeur' as prix
      FROM station as s
      cross join jsonb_array_elements(prix) as elem
      WHERE s.id = ${id}
      AND elem->'id_carburant' = ${fuel};
    `;
  }

  public static getAllByFuel(fuel: number): string {
    return `
      SELECT ${StationsRepo.COLUMNS.map((s) => "s." + s).join(", ")}
      FROM station as s
      cross join jsonb_array_elements(prix) as elem
      WHERE elem->'id_carburant' = ${fuel};
    `;
  }

  private static getInsertValueString(station: Station): string {
    return `(${station.id},${station.latitude}, ${station.longitude}, ${station.cp}, '${station.pop}', '${
      station.adresse.replaceAll("'", "''")
    }', '${station.ville.replaceAll("'", "''")}', ${
      StationsRepo.stringify(station.horaires)
    }, ${StationsRepo.stringify(station.prix)})`;
  }

  private static stringify(object: unknown): string {
    return object
      ? `'${JSON.stringify(object)}'${Array.isArray(object) ? "::jsonb" : ""}`
      : "NULL";
  }
}
