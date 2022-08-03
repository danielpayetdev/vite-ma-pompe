import { Presence } from "./presence.ts";
import { TypeCarburant } from "./type-carburant.ts";

export interface Station {
  '@id': string;
  '@latitude': number;
  '@longitude': number;
  '@cp': string;
  '@pop': Presence;
  adresse: string;
  ville: string;
  horaires: Horaire;
  prix: Prix[];
}

export interface Horaire {
  "@automate-24-24": boolean;
  jour: Jour[];
}

export interface Jour {
  '@id': number;
  '@nom': string;
  '@ferme': boolean;
}

export interface Prix {
  '@id': string;
  '@nom': TypeCarburant;
  '@maj': string;
  '@valeur': string;
}
