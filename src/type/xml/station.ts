import { Presence } from "../presence.ts";
import { NomCarburant, TypeCarburant } from "../type-carburant.ts";

export interface StationXML {
  '@id': number;
  '@latitude': number;
  '@longitude': number;
  '@cp': string;
  '@pop': Presence;
  adresse: string;
  ville: string;
  horaires?: HoraireXML;
  prix?: PrixXML[];
}

export interface HoraireXML {
  "@automate-24-24": boolean;
  jour: JourXML[];
}

export interface JourXML {
  '@id': 1 | 2 | 3 | 4 | 5 | 6 | 7;
  '@nom': string;
  '@ferme': boolean;
}

export interface PrixXML {
  '@id': TypeCarburant;
  '@nom': NomCarburant;
  '@maj': string;
  '@valeur': number;
}