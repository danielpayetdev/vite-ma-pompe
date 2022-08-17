import { sdk } from "./deps.ts";
import { DownloadData } from "./download-data.ts";

const DATABASE = "stations-db";
const COLLECTION_STATION = "stations";
const COLLECTION_HISTORIQUE = "historique";

// deno-lint-ignore no-explicit-any
export default async function (req: any, res: any) {
  if (!req.env["FORCE_HTTP"] && req.env["APPWRITE_FUNCTION_TRIGGER"] !== "schedule") {
    res.send("Not a schedule trigger", 403);
    return;
  }

  const client = new sdk.Client();
  const database = new sdk.Databases(client, DATABASE);
  if (!req.env["APPWRITE_FUNCTION_ENDPOINT"] || !req.env["APPWRITE_FUNCTION_API_KEY"]) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    console.log(req.env);
    client
      .setEndpoint(req.env["APPWRITE_FUNCTION_ENDPOINT"] as string)
      .setProject(req.env["APPWRITE_FUNCTION_PROJECT_ID"] as string)
      .setKey(req.env["APPWRITE_FUNCTION_API_KEY"] as string);
  }

  const data = await new DownloadData().download();

  if (data) {
    try {
      const stationsDoc = await Promise.all(
        data.map(async (station) => {
          const prix = station.prix?.map((p) => JSON.stringify(p));
          const horaires = JSON.stringify(station.horaires);
          return await database.createDocument(COLLECTION_STATION, "unique()", { ...station, horaires, prix });
        })
      );
      await database.createDocument(COLLECTION_HISTORIQUE, "unique()", { stations: stationsDoc.map((s) => s.$id) });
    } catch (e) {
      console.error(e.message);
      res.send("Error while saving data: " + e.message, 500);
      return;
    }
  } else {
    res.send("Error while downloading data", 500);
    return;
  }

  res.send("ok", 200);
}
