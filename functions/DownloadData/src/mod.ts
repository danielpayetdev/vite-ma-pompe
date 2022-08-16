import { sdk } from "./deps.ts";
import { DownloadData } from "./download-data.ts";

const DATABASE = "stations-db";
const COLLECTION_STATION = "stations";
const COLLECTION_HORAIRES = "horaires";
const COLLECTION_JOUR = "jour";
const COLLECTION_PRIX = "prix";

// deno-lint-ignore no-explicit-any
export default async function (req: any, res: any) {
  if (req.env["APPWRITE_FUNCTION_TRIGGER"] !== "schedule") {
    //res.send("Not a schedule trigger", 403);
    //return;
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

  const data = fakeData; //await new DownloadData().download();

  if (data) {
    try {
      await Promise.all(
        data.map(async (station) => {
          const prixDocs = await Promise.all(station.prix?.map((prix) => database.createDocument(COLLECTION_PRIX, "unique()", prix)) ?? []);
          const jourDocs = await Promise.all(station.horaires?.jour?.map((jour) => database.createDocument(COLLECTION_JOUR, "unique()", jour)) ?? []);
          const horairesDoc = await database.createDocument(COLLECTION_HORAIRES, "unique()", { ...station.horaires, jour: jourDocs.map((j) => j.$id) });
          await database.createDocument(COLLECTION_STATION, station.id.toString(), { ...station, horaires: horairesDoc.$id, prix: prixDocs.map((d) => d.$id) });
        })
      );
    } catch (e) {
      console.error(e.message);
      res.send("Error while saving data", 500);
      return;
    }
  } else {
    res.send("Error while downloading data", 500);
    return;
  }

  res.send("ok", 200);
}

const fakeData = [
  {
    id: 59780003,
    latitude: 50.594774550000004,
    longitude: 3.2578184717473997,
    cp: 59780,
    pop: "R",
    adresse: "RD 93 GRANDE RUE",
    ville: "Camphin-en-Pévèle",
    horaires: {
      automate2424: true,
      jour: [
        { id_jour: 1, nom: "Lundi", ferme: true },
        { id_jour: 2, nom: "Mardi", ferme: true },
        { id_jour: 3, nom: "Mercredi", ferme: true },
        { id_jour: 4, nom: "Jeudi", ferme: true },
        { id_jour: 5, nom: "Vendredi", ferme: true },
        { id_jour: 6, nom: "Samedi", ferme: true },
        { id_jour: 7, nom: "Dimanche", ferme: true },
      ],
    },
    prix: [
      // { id_carburant: 1, nom: "Gazole", maj: "2022-08-11 12:54:51", valeur: 1.769 },
      //{ id_carburant: 3, nom: "E85", maj: "2022-08-11 12:54:51", valeur: 0.759 },
      //{ id_carburant: 5, nom: "E10", maj: "2022-08-11 12:54:51", valeur: 1.716 },
      //{ id_carburant: 6, nom: "SP98", maj: "2022-08-11 12:54:52", valeur: 1.819 },
    ],
  },
];
