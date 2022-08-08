import { Presence } from "../presence.ts";
import { NomCarburant, TypeCarburant } from "../type-carburant.ts";

export interface Station {
  id: number;
  latitude: number;
  longitude: number;
  cp: string;
  pop: Presence;
  adresse: string;
  ville: string;
  horaires?: Horaire;
  prix?: Prix[];
}

export interface Horaire {
  id?: number;
  automate2424: boolean;
  jour: Jour[];
}

export interface Jour {
  id?: number;
  id_jour: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  nom: string;
  ferme: boolean;
}

export interface Prix {
  id?: number;
  id_carburant: TypeCarburant;
  nom: NomCarburant;
  maj: string;
  valeur: number;
}
