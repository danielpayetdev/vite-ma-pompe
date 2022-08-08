import { initDB, isDataBaseOutdated } from "./database.ts";
import { join, node, os, parse, unZipFromURL } from "./deps.ts";
import { StationXML } from "./type/xml/station.ts";
import { XmlMapper } from "./services/xml-mapper.ts";

export class DownloadData {
  private static readonly URL = "https://donnees.roulez-eco.fr/opendata/instantane";

  public async download(): Promise<void> {
    if (await isDataBaseOutdated()) {
      console.log("Datbase is outdated. Downloading new data...");
      const temp = join(os.tempDir(), "prix_temp");
      let resultat = await unZipFromURL(DownloadData.URL, temp);
      if (resultat) {
        resultat += "/PrixCarburants_instantane.xml";
        const stations = new TextDecoder("windows-1252").decode(await Deno.readFile(resultat));
        console.time("Parsing");
        const xml = parse(stations, {
          reviveBooleans: true,
          reviveNumbers: true,
          progress: (bytes) => Deno.stdout.writeSync(new TextEncoder().encode(`Parsing document: ${((100 * bytes) / stations.length).toFixed(2)}%\r`)),
        });
        console.log();
        this.saveToDB((xml["pdv_liste"] as node)?.["pdv"] as StationXML[]);
        console.timeEnd("Parsing");
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
