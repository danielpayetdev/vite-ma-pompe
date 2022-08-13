import { log } from "./deps.ts";
import { configureLogger } from "./log.ts";
import { DownloadData } from "./services/download-data.ts";

await configureLogger('worker');

const downloadData = async (retry = 0) => {
  const data = await new DownloadData().download();
  if(data === undefined && retry < 3) {
    log.getLogger().warning("Retrying in 10 seconds...");
    setTimeout(() => downloadData(retry+1), 10000);
  } else {
    self.postMessage(data);
    self.close();
  }
}

downloadData();