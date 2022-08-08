import { join, node, os, parse, unZipFromURL } from "./deps.ts";
import { StationXML } from "./type/xml/station.ts";
import { XmlMapper } from "./services/xml-mapper.ts";
import { Station } from "./type/interface/station.ts";

export class DownloadData {
  private static readonly URL = "https://donnees.roulez-eco.fr/opendata/instantane";

  public async download(): Promise<Station[] | undefined> {
    console.log("Downloading new data...");
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
      console.log("\nDone.");
      console.timeEnd("Parsing time");
      Deno.remove(resultat);
      return this.mapToJson((xml["pdv_liste"] as node)?.["pdv"] as StationXML[]);
    } else {
      throw new Error("Error while unzip data");
    }
  }

  private mapToJson(data: StationXML[]): Station[] {
    const mapper = new XmlMapper();
    return data.map((d) => mapper.mapStation(d));
  }
}
