import { join, log, node, os, parse, unZipFromURL } from "../deps.ts";
import { StationXML } from "../type/xml/station.ts";
import { XmlMapper } from "./xml-mapper.ts";
import { Station } from "../type/interface/station.ts";

/**
 * DownloadData is responsible for downloading the data from the server wich come from the French government.
 */
export class DownloadData {
  private static readonly URL = "https://donnees.roulez-eco.fr/opendata/instantane";

  public async download(): Promise<Station[] | undefined> {
    log.getLogger().info("Downloading new data...");
    const temp = join(os.tempDir(), "prix_temp");
    let resultat: string | false;
    try {
      resultat = await unZipFromURL(DownloadData.URL, temp);
    } catch (e) {
      log.getLogger().error("Failed to download data.", e);
      return;
    }
    if (resultat) {
      resultat += "/PrixCarburants_instantane.xml";
      const stations = new TextDecoder("windows-1252").decode(await Deno.readFile(resultat));
      console.time("Parsing time");
      log.getLogger().info("Parsing (it may take a while)...");
      const xml = parse(stations, {
        reviveBooleans: true,
        reviveNumbers: true,
      });
      log.getLogger().info("Done.");
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
