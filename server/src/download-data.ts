import { initDB, isDataBaseOutdated } from "./database.ts";
import { join, node, os, parse, unZipFromURL } from "./deps.ts";
import { StationXML } from "./type/xml/station.ts";
import { XmlMapper } from "./services/xml-mapper.ts";

export class DownloadData {
  private static readonly URL = "https://donnees.roulez-eco.fr/opendata/instantane";

  public async download(): Promise<void> {
    if (await isDataBaseOutdated()) {
      console.log("Datbase is outdated or does not exist. Downloading new data...");
      const temp = join(os.tempDir(), "prix_temp");
      let resultat = await unZipFromURL(DownloadData.URL, temp);
      if (resultat) {
        resultat += "/PrixCarburants_instantane.xml";
        const stations = new TextDecoder("windows-1252").decode(await Deno.readFile(resultat));
        console.time("Parsing time");
        Deno.stdout.writeSync(new TextEncoder().encode("Parsing (it may take a while)..."));
        let previousTime = new Date().getTime();
        const xml = parse(stations, {
          reviveBooleans: true,
          reviveNumbers: true,
          progress: () => {
            const currentTime = new Date().getTime();
            if (previousTime + 1000 < currentTime) {
              Deno.stdout.writeSync(new TextEncoder().encode(`.`));
              previousTime = currentTime;
            }
          },
        });
        console.log("Done.");
        this.saveToDB((xml["pdv_liste"] as node)?.["pdv"] as StationXML[]);
        console.timeEnd("Parsing time");
        Deno.remove(resultat);
      } else {
        throw new Error("Error while unzip data");
      }
    } else {
      console.log("Database is up to date.");
    }
  }

  private saveToDB(data: StationXML[]): void {
    const mapper = new XmlMapper();
    initDB(data.map((d) => mapper.mapStation(d)));
  }
}
