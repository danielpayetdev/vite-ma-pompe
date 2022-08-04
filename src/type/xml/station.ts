import { Presence } from "../presence.ts";
import { Horaire, Jour, Prix, Station } from "../station.ts";
import { TypeCarburant } from "../type-carburant.ts";


export interface StationXML {
  '@id': string;
  '@latitude': number;
  '@longitude': number;
  '@cp': string;
  '@pop': Presence;
  adresse: string;
  ville: string;
  horaires: HoraireXML;
  prix: PrixXML[];
}

export interface HoraireXML {
  "@automate-24-24": boolean;
  jour: JourXML[];
}

export interface JourXML {
  '@id': number;
  '@nom': string;
  '@ferme': boolean;
}

export interface PrixXML {
  '@id': string;
  '@nom': TypeCarburant;
  '@maj': string;
  '@valeur': string;
}