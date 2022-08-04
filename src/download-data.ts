import { document, join, node, os } from "./deps.ts";
import { Station } from "./type/station.ts";
import { StationXML } from "./type/xml/station.ts";
import { XmlMapper } from "./utils/xml-mapper.ts";

export class DownloadData {
  private static readonly URL = "https://donnees.roulez-eco.fr/opendata/instantane";

  public async download(): Promise<void> {
    const temp = join(os.tempDir(), "prix_temp");
    let resultat = temp;
    //let resultat = await unZipFromURL(DownloadData.URL, temp);
    if (resultat) {
      resultat += "/PrixCarburants_instantane.xml";
      const prix = await Deno.readTextFile(resultat);
      console.time("Parsing");
      const xml = a as unknown as document;
      // const xml = parse(prix, {
      //   reviveBooleans: true,
      //   reviveNumbers: true,
      //   progress: (bytes) => Deno.stdout.writeSync(new TextEncoder().encode(`Parsing document: ${((100 * bytes) / prix.length).toFixed(2)}%\r`)),
      // });
      console.log();
      this.saveToDB(((xml["pdv_liste"] as node)?.["pdv"]) as StationXML[]);
      console.timeEnd("Parsing");

      //Deno.remove(resultat);
    } else {
      throw new Error("Error while unzip data");
    }
  }

  private saveToDB(data: StationXML[]): void {
    const mapper = new XmlMapper();
    data.map(d => mapper.mapStation(d));
  }
}

const a = {
  "@id": 59780003,
  "@latitude": 5059477.455,
  "@longitude": 325781.84717474,
  "@cp": 59780,
  "@pop": "R",
  adresse: "RD 93 GRANDE RUE",
  ville: "Camphin-en-P�v�le",
  horaires: {
    "@automate-24-24": 1,
    jour: [
      { "@id": 1, "@nom": "Lundi", "@ferme": 1, horaire: [Object] },
      { "@id": 2, "@nom": "Mardi", "@ferme": 1, horaire: [Object] },
      { "@id": 3, "@nom": "Mercredi", "@ferme": 1, horaire: [Object] },
      { "@id": 4, "@nom": "Jeudi", "@ferme": 1, horaire: [Object] },
      { "@id": 5, "@nom": "Vendredi", "@ferme": 1, horaire: [Object] },
      { "@id": 6, "@nom": "Samedi", "@ferme": 1, horaire: [Object] },
      { "@id": 7, "@nom": "Dimanche", "@ferme": 1, horaire: [Object] },
    ],
  },
  services: {
    service: ["Laverie", "Station de gonflage", "Lavage automatique", "Automate CB 24/24"],
  },
  prix: [
    {
      "@nom": "Gazole",
      "@id": 1,
      "@maj": "2022-08-02 11:27:09",
      "@valeur": 1.857,
      "#text": null,
    },
    {
      "@nom": "E85",
      "@id": 3,
      "@maj": "2022-08-02 11:27:09",
      "@valeur": 0.727,
      "#text": null,
    },
    {
      "@nom": "E10",
      "@id": 5,
      "@maj": "2022-08-02 11:27:09",
      "@valeur": 1.822,
      "#text": null,
    },
    {
      "@nom": "SP98",
      "@id": 6,
      "@maj": "2022-08-02 11:27:10",
      "@valeur": 1.909,
      "#text": null,
    },
  ],
};
