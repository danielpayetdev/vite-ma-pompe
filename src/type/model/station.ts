import { DataTypes, Model, Relationships } from "../../deps.ts";

export class StationModel extends Model {
  static table = "station";

  static fields = {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    latitude: DataTypes.INTEGER,
    longitude: DataTypes.INTEGER,
    cp: DataTypes.STRING,
    pop: DataTypes.STRING,
    adresse: DataTypes.STRING,
    ville: DataTypes.STRING,
  };

  static horaires() {
    return this.hasOne(HoraireModel);
  }

  static prix() {
    return this.hasMany(PrixModel);
  }
}

export class HoraireModel extends Model {
  static table = "horaire";

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    latitude: DataTypes.INTEGER,
    longitude: DataTypes.INTEGER,
    cp: DataTypes.STRING,
    pop: DataTypes.STRING,
    adresse: DataTypes.STRING,
    ville: DataTypes.STRING,
  };

  static station() {
    return this.hasOne(StationModel);
  }

  static jours() {
    return this.hasMany(JourModel);
  }
}

export class JourModel extends Model {
  static table = "jour";

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING,
    ferme: DataTypes.BOOLEAN,
  };

  static horaire() {
    return this.hasOne(HoraireModel);
  }
}

export class PrixModel extends Model {
  static table = "prix";

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_carburant: DataTypes.STRING,
    nom: DataTypes.STRING,
    maj: DataTypes.STRING,
    valeur: DataTypes.STRING,
  };

  static horaire() {
    return this.hasOne(HoraireModel);
  }
}

Relationships.oneToOne(StationModel, HoraireModel);
Relationships.belongsTo(HoraireModel, StationModel);
Relationships.belongsTo(JourModel, HoraireModel);
Relationships.belongsTo(PrixModel, StationModel);