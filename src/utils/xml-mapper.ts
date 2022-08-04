import { Station, Horaire, Jour, Prix } from "../type/station.ts";
import { StationXML, HoraireXML, JourXML, PrixXML } from "../type/xml/station.ts";

export class XmlMapper {
  public mapStation(xml: StationXML): Station {
    return {
      id: xml["@id"],
      latitude: xml["@latitude"],
      longitude: xml["@longitude"],
      cp: xml["@cp"],
      pop: xml["@pop"],
      adresse: xml.adresse,
      ville: xml.ville,
      horaires: this.mapHoraire(xml.horaires),
      prix: this.mapPrix(xml.prix)
    }
  }

  private mapHoraire(xml: HoraireXML): Horaire {
    return {
      automate2424: xml["@automate-24-24"],
      jour: this.mapJour(xml.jour),
    }
  }

  private mapJour(xml: JourXML[]): Jour[] {
    return xml.map(jour => ({
      id: jour["@id"],
      nom: jour["@nom"],
      ferme: jour["@ferme"],
    }));
  }

  private mapPrix(xml: PrixXML[]): Prix[] {
    return xml.map(prix => ({
      id: prix["@id"],
      nom: prix["@nom"],
      maj: prix["@maj"],
      valeur: prix["@valeur"],
    }));
  }
}