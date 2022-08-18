import { Models, sdk } from "./deps.ts";
import { FindByLocationProcess } from "./find-by-location.ts";

const DATABASE = "stations-db";
const COLLECTION_STATION = "stations";
const COLLECTION_HISTORIQUE = "historique";

interface StationDocument extends Models.Document {
  stations: string[];
}

// deno-lint-ignore no-explicit-any
export default async function (req: any, res: any) {
  const client = new sdk.Client();
  const database = new sdk.Databases(client, DATABASE);
  if (!req.env["APPWRITE_FUNCTION_ENDPOINT"] || !req.env["APPWRITE_FUNCTION_API_KEY"]) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.env["APPWRITE_FUNCTION_ENDPOINT"] as string)
      .setProject(req.env["APPWRITE_FUNCTION_PROJECT_ID"] as string)
      .setKey(req.env["APPWRITE_FUNCTION_API_KEY"] as string);
  }

  try {
    const stationsID = (await database.listDocuments<StationDocument>(COLLECTION_HISTORIQUE, [], 1, 0, "", undefined, ["$createdAt"], ["DESC"]))?.documents?.[0].stations;
    res.json(new FindByLocationProcess().aroundPosition(stationsID, req.query.lat, req.query.lng));
  } catch (e) {
    console.error(e.message);
    res.send("Error while retrieve data: " + e.message, 500);
    return;
  }

  res.send("ok", 200);
}
