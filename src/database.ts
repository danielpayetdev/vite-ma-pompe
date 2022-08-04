import { Database, SQLite3Connector } from "./deps.ts";
import { HoraireModel, JourModel, PrixModel, StationModel } from "./type/model/station.ts";

const DB_NAME = "fuel-price.db";

const connection = new SQLite3Connector({
  filepath: DB_NAME,
});

export async function initDB(): Promise<Database> {
  const d = new Database(connection);
  d.link([StationModel, HoraireModel, JourModel, PrixModel]);
  d.sync({ drop: true });
  await JourModel.create({
    nom: "lundi",
    ferme: false,
  });
  return d;
}
