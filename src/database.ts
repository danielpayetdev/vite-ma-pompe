import { Database, SQLite3Connector } from "./deps.ts";
import { StationXML } from "./type/xml/station.ts";

const DB_NAME = "fuel-price.db";

const connection = new SQLite3Connector({
  filepath: DB_NAME
})

function getDataBaseForRead(): Database {
  return new Database(connection);
}

// function initDataBase(): Database {
//   const db = new DB(DB_NAME);
//   db.query(`
//   CREATE TABLE IF NOT EXISTS station (
//       id TEXT PRIMARY KEY,
//       latitude INTEGER,
//       longitude INTEGER,
//       cp TEXT,
//       pop TEXT,
//       adresse TEXT,
//       ville TEXT
//   );

//   CREATE TABLE IF NOT EXISTS horaire (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       station_id TEXT,
//       automate_24_24 BOOL
//   );

//   CREATE TABLE IF NOT EXISTS jour (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       jour_id INTEGER,
//       horaire_id INTEGER,
//       nom TEXT,
//       ferme BOOL
//   );

//   CREATE TABLE IF NOT EXISTS prix (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       station_id TEXT,
//       nom TEXT,
//       maj TEXT,
//       valeur TEXT
//   );

//   INSERT INTO 
//       station (id, latitude, longitude, cp, pop, adresse, ville) 
//       VALUES (${station["@id"]}, ${station["@latitude"]}, ${station["@longitude"]}, ${station["@cp"]}, ${station["@pop"]}, ${station.adresse}, ${station.ville}}});     
// `)
// }

export function getStationForID(id: string): Station {
  //return getDataBaseForRead().query("SELECT * FROM station WHERE id = ?", [id])[0][0] as Station;
}

export function saveStation(station: Station): void {
  const db = getDataBase();
  db.query(`
    CREATE TABLE IF NOT EXISTS station (
        id TEXT PRIMARY KEY,
        latitude INTEGER,
        longitude INTEGER,
        cp TEXT,
        pop TEXT,
        adresse TEXT,
        ville TEXT
    );

    CREATE TABLE IF NOT EXISTS horaire (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id TEXT,
        automate_24_24 BOOL
    );

    CREATE TABLE IF NOT EXISTS jour (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jour_id INTEGER,
        horaire_id INTEGER,
        nom TEXT,
        ferme BOOL
    );

    CREATE TABLE IF NOT EXISTS prix (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id TEXT,
        nom TEXT,
        maj TEXT,
        valeur TEXT
    );

    INSERT INTO 
        station (id, latitude, longitude, cp, pop, adresse, ville) 
        VALUES (${station["@id"]}, ${station["@latitude"]}, ${station["@longitude"]}, ${station["@cp"]}, ${station["@pop"]}, ${station.adresse}, ${station.ville}}});     
  `);
  db.close();
}
