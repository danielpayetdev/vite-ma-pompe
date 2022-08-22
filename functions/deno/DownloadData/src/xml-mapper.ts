import { Horaire, Jour, Prix, Station } from "../../common/type/interface/station.ts";
import { StationXML, HoraireXML, JourXML, PrixXML } from "../../common/type/xml/station.ts";

/**
 * XmlMapper is responsible for mapping the XML data to the Station type.
 */
export class XmlMapper {
  public mapStation(xml: StationXML): Station {
    return {
      id: xml["@id"],
      latitude: xml["@latitude"] /100000,
      longitude: xml["@longitude"] /100000,
      cp: xml["@cp"],
      pop: xml["@pop"],
      adresse: xml.adresse,
      ville: xml.ville,
      horaires: this.mapHoraire(xml.horaires),
      prix: this.mapPrix(xml.prix),
    };
  }

  private mapHoraire(xml?: HoraireXML): Horaire | undefined {
    return xml !== undefined
      ? {
          automate2424: !!xml["@automate-24-24"],
          jour: this.mapJour(xml.jour),
        }
      : undefined;
  }

  private mapJour(xml: JourXML[]): Jour[] {
    return xml.map((jour) => ({
      id_jour: jour["@id"],
      nom: jour["@nom"],
      ferme: !!jour["@ferme"],
    }));
  }

  private mapPrix(xml?: PrixXML[] | PrixXML): Prix[] | undefined {
    if (xml === undefined) {
      return undefined;
    } else if (Array.isArray(xml)) {
      return xml?.map((prix) => ({
        id_carburant: prix["@id"],
        nom: prix["@nom"],
        maj: prix["@maj"],
        valeur: prix["@valeur"],
      }));
    } else{
      return [{
        id_carburant: xml["@id"],
        nom: xml["@nom"],
        maj: xml["@maj"],
        valeur: xml["@valeur"],
      }];
    }
  }
}
