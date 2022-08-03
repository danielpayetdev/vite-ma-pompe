import * as jszip from "jszip";
import { Parse } from "unzipper";
import * as fs from "fs";

export class DownloadData {
  private static readonly URL = "https://donnees.roulez-eco.fr/opendata/instantane";
  private static readonly FILE_NAME = "./prix_carburants.zip";

  public async download(): Promise<void> {
    const response = await fetch(DownloadData.URL);
    const data = await response.blob();
    if (data != null) {
      Bun.write(DownloadData.FILE_NAME, data);
      this.unzip(data);
    }
  }

  private async unzip(file): Promise<any> {
    const stream = (fs.readFileSync("/Users/david/data.zip").buffer as Buffer).pipe(Parse());

    return new Promise((resolve, reject) => {
      stream.on("entry", (entry) => {
        const writeStream = createWriteStream(`/Users/david/${entry.path}`);
        return entry.pipe(writeStream);
      });
      stream.on("finish", () => resolve());
      stream.on("error", (error) => reject(error));
    });
  }
}
