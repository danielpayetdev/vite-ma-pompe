import 'package:json_annotation/json_annotation.dart';

part 'stations.g.dart';

@JsonSerializable()
class Station {
  final int id;
  @JsonKey(readValue: _latlngFromJson)
  final double latitude;
  @JsonKey(readValue: _latlngFromJson)
  final double longitude;
  final int cp;
  final String pop;
  final String adresse;
  final String ville;
  final Horaire? horaires;
  final List<Prix>? prix;

  Station(this.id, this.latitude, this.longitude, this.cp, this.pop, this.adresse, this.ville, this.horaires, this.prix);

  factory Station.fromJson(Map<String, dynamic> json) => _$StationFromJson(json);

  Map<String, dynamic> toJson() => _$StationToJson(this);

  static double _latlngFromJson(Map map, String key) {
    return double.parse(map[key]);
  }
}

@JsonSerializable()
class Horaire {
  @JsonKey(defaultValue: false)
  final bool automate2424;
  final List<Jour> jour;

  Horaire(this.automate2424, this.jour);

  factory Horaire.fromJson(Map<String, dynamic> json) => _$HoraireFromJson(json);

  Map<String, dynamic> toJson() => _$HoraireToJson(this);
}

@JsonSerializable()
class Jour {
  @JsonKey(name: 'id_jour')
  final int idJour;
  final String nom;
  @JsonKey(defaultValue: false)
  final bool ferme;

  Jour(this.idJour, this.nom, this.ferme);

  factory Jour.fromJson(Map<String, dynamic> json) => _$JourFromJson(json);

  Map<String, dynamic> toJson() => _$JourToJson(this);
}

@JsonSerializable()
class Prix {
  @JsonKey(name: 'id_carburant')
  final int idCarburant;
  final String nom;
  final String maj;
  final double valeur;

  Prix({required this.idCarburant, required this.nom, required this.maj, required this.valeur});

  factory Prix.fromJson(Map<String, dynamic> json) => _$PrixFromJson(json);

  Map<String, dynamic> toJson() => _$PrixToJson(this);
}
