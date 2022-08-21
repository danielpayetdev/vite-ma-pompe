import { Station } from "../../common/type/interface/station.ts";
import { StationXML } from "../../common/type/xml/station.ts";
import { BlobReader, node, parse, ZipReader } from "./deps.ts";
import { XmlMapper } from "./xml-mapper.ts";

/**
 * DownloadData is responsible for downloading the data from the server wich come from the French government.
 */
export class DownloadData {
  private static readonly URL =
    "https://donnees.roulez-eco.fr/opendata/instantane";

  public async download(): Promise<Station[] | undefined> {
    console.log("Downloading data...");
    let fileData: string;
    try {
      const zipFileBlob = await this.downloadFile();
      fileData = await this.readZip(zipFileBlob);
    } catch (e) {
      console.error("Failed to download data.", e);
      return;
    }
    console.time("Parsing time");
    const xml = parse(fileData, {
      reviveBooleans: true,
      reviveNumbers: true,
      progress: (bytes) =>
        Deno.stdout.writeSync(
          new TextEncoder().encode(
            `Parsing document: ${(100 * bytes / fileData.length).toFixed(2)}%\r`,
          ),
        ),
    });
    console.timeEnd("\nParsing time");
    return this.mapToJson((xml["pdv_liste"] as node)?.["pdv"] as StationXML[]);
  }

  private mapToJson(data: StationXML[]): Station[] {
    const mapper = new XmlMapper();
    return data.map((d) => mapper.mapStation(d));
  }

  private async downloadFile(): Promise<Blob> {
    const response = await fetch(DownloadData.URL);
    return await response.blob();
  }

  private async readZip(zipFileBlob: Blob): Promise<string> {
    const zipFileReader = new BlobReader(zipFileBlob);
    const helloWorldWriter = new TransformStream();
    const helloWorldTextPromise = new Response(helloWorldWriter.readable)
      .arrayBuffer();
    const zipReader = new ZipReader(zipFileReader);
    const firstEntry = (await zipReader.getEntries()).shift();

    await firstEntry?.getData?.(helloWorldWriter);
    await zipReader.close();
    return new TextDecoder("windows-1252").decode(await helloWorldTextPromise);
  }
}
