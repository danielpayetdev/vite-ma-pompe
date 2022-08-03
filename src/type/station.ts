import { Presence } from "./presence";
import { TypeCarburant } from "./type-carburant";

export interface Station {
  id: string;
  latitude: number;
  longitude: number;
  codePostal: string;
  presence: Presence;
  adresse: string;
  ville: string;
  horaires: Horaire;
  prix: Prix[];
}

export interface Horaire {
  isAutomate2424: boolean;
  jour: Jour;
}

export interface Jour {
  id: number;
  nom: string;
  ferme: boolean;
}

export interface Prix {
  id: string;
  nom: TypeCarburant;
  maj: string;
  valeur: string;
}
