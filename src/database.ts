import { DB } from "https://deno.land/x/sqlite@v3.4.0/mod.ts";
import { Station } from "./type/station.ts";

const DB_NAME = "fuel-price.db";

function getDataBaseForRead(): DB {
  return new DB(DB_NAME, { mode: "read" });
}

function getDataBase(): DB {
  return new DB(DB_NAME);
}

export function getStationForID(id: string): Station {
  return getDataBaseForRead().query("SELECT * FROM station WHERE id = ?", [id])[0][0] as Station;
}

export function saveStation(station: Station): void {
  const db = getDataBase();
  db.execute(`
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
