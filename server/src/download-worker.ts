import { DownloadData } from "./download-data.ts";

self.onmessage = async () => {
  self.postMessage(await new DownloadData().download())
  self.close();
};
