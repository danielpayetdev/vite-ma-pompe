import { DownloadData } from "./services/download-data.ts";

self.onmessage = async () => {
  self.postMessage(await new DownloadData().download())
  self.close();
};
