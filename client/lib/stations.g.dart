// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'stations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Station _$StationFromJson(Map<String, dynamic> json) => Station(
      json['id'] as int,
      (Station._latlngFromJson(json, 'latitude')).toDouble(),
      (Station._latlngFromJson(json, 'longitude')).toDouble(),
      json['cp'] as int,
      json['pop'] as String,
      json['adresse'] as String,
      json['ville'] as String,
      json['horaires'] == null
          ? null
          : Horaire.fromJson(json['horaires'] as Map<String, dynamic>),
      (json['prix'] as List<dynamic>?)
          ?.map((e) => Prix.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$StationToJson(Station instance) => <String, dynamic>{
      'id': instance.id,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'cp': instance.cp,
      'pop': instance.pop,
      'adresse': instance.adresse,
      'ville': instance.ville,
      'horaires': instance.horaires,
      'prix': instance.prix,
    };

Horaire _$HoraireFromJson(Map<String, dynamic> json) => Horaire(
      json['automate2424'] as bool? ?? false,
      (json['jour'] as List<dynamic>)
          .map((e) => Jour.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$HoraireToJson(Horaire instance) => <String, dynamic>{
      'automate2424': instance.automate2424,
      'jour': instance.jour,
    };

Jour _$JourFromJson(Map<String, dynamic> json) => Jour(
      json['id_jour'] as int,
      json['nom'] as String,
      json['ferme'] as bool? ?? false,
    );

Map<String, dynamic> _$JourToJson(Jour instance) => <String, dynamic>{
      'id_jour': instance.idJour,
      'nom': instance.nom,
      'ferme': instance.ferme,
    };

Prix _$PrixFromJson(Map<String, dynamic> json) => Prix(
      idCarburant: json['id_carburant'] as int,
      nom: json['nom'] as String,
      maj: json['maj'] as String,
      valeur: (json['valeur'] as num).toDouble(),
    );

Map<String, dynamic> _$PrixToJson(Prix instance) => <String, dynamic>{
      'id_carburant': instance.idCarburant,
      'nom': instance.nom,
      'maj': instance.maj,
      'valeur': instance.valeur,
    };
