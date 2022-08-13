import { DownloadData } from "./services/download-data.ts";

const downloadData = async (retry = 0) => {
  const data = await new DownloadData().download();
  if(data === undefined && retry <= 3) {
    console.log("Retrying in 10 seconds...");
    setTimeout(() => downloadData(retry++), 10000);
  }
  self.postMessage(data);
  self.close();
}

await downloadData();