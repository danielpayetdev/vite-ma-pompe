import 'dart:convert';

import 'package:appwrite/models.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:maps_launcher/maps_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:appwrite/appwrite.dart';
import 'package:vite_ma_pompe/stations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late final MapController mapController;

  final LatLngBounds france = LatLngBounds(
    LatLng(51.257755, -5.722069),
    LatLng(40.835374, 10.607903),
  );

  late final Client client;
  late final Functions functions;
  late final Account account;

  bool isStationsLoading = true;

  List<Marker> _markers = [];

  @override
  void initState() {
    super.initState();
    mapController = MapController();
    client = Client();
    client.setEndpoint('https://api.vitemapompe.fr/v1').setProject('vite-ma-pompe');
    functions = Functions(client);
    account = Account(client);
    _updateMarkers();
  }

  void _updateMarkers() async {
    setState(() {
      isStationsLoading = true;
    });
    Position? position = await _getPositionUser();
    List<Station> stations = await _getStations(position != null ? LatLng(position.latitude, position.longitude) : mapController.center);
    setState(() {
      _markers = _getMarkers(stations);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<Position?>(
        future: _getPositionUser(),
        builder: (context, snapshot) {
          return snapshot.hasData
              ? FlutterMap(
                  mapController: mapController,
                  options: MapOptions(
                    center: snapshot.data != null ? LatLng(snapshot.data!.latitude, snapshot.data!.longitude) : null,
                    zoom: 13,
                    maxZoom: 17.0,
                    maxBounds: france,
                    plugins: [
                      const LocationMarkerPlugin(),
                    ],
                  ),
                  layers: [
                    TileLayerOptions(
                      urlTemplate: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
                      subdomains: ['a', 'b', 'c'],
                      backgroundColor: Colors.white,
                    ),
                    LocationMarkerLayerOptions(),
                    MarkerLayerOptions(
                      markers: _markers,
                    ),
                  ],
                  nonRotatedChildren: [
                    AttributionWidget(
                      alignment: Alignment.bottomRight,
                      attributionBuilder: (context) => const ViteMaPompeAttribution(),
                    ),
                    MapControls(
                      onCenter: () async {
                        Position? position = await _getPositionUser();
                        if (position != null) {
                          _updateMarkers();
                          mapController.move(LatLng(position.latitude, position.longitude), 13);
                        }
                      },
                      onZoomIn: () => mapController.move(mapController.center, mapController.zoom + 1),
                      onZoomOut: () => mapController.move(mapController.center, mapController.zoom - 1),
                    ),
                    Align(
                        alignment: Alignment.topLeft,
                        child: Builder(
                            builder: (contexte) => isStationsLoading
                                ? const Padding(
                                    padding: EdgeInsets.only(left: 16.0, top: 40.0),
                                    child: CircularProgressIndicator(),
                                  )
                                : Container()))
                  ],
                )
              : const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }

  Future<Position?> _getPositionUser() async {
    if (kIsWeb) {
      return Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.bestForNavigation);
    } else if (await Permission.locationWhenInUse.request().isGranted) {
      return Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.bestForNavigation);
    }
    return null;
  }

  List<Marker> _getMarkers(List<Station> stations) {
    return stations
        .map(
          (s) => Marker(
            point: LatLng(s.latitude, s.longitude),
            width: 60.0,
            anchorPos: AnchorPos.align(AnchorAlign.bottom),
            builder: ((context) => GestureDetector(
                  onTap: () {
                    showModalBottomSheet<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return SizedBox(
                            height: 300,
                            child: Center(
                              child: ListView(
                                children: [
                                  ListTile(
                                    title: Text('${s.adresse} ${s.ville} ${s.cp}'),
                                    trailing: TextButton.icon(
                                      onPressed: () {
                                        MapsLauncher.launchCoordinates(s.latitude, s.longitude);
                                      },
                                      icon: const Icon(Icons.near_me_rounded),
                                      label: const Text("Go !"),
                                    ),
                                  ),
                                  const Divider(),
                                  ...(s.prix
                                          ?.map((e) => ListTile(
                                                leading: Text(e.nom),
                                                title: Text("${e.valeur}€"),
                                              ))
                                          .toList() ??
                                      [])
                                ],
                              ),
                            ),
                          );
                        });
                  },
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    children: [
                      ColoredBox(
                        color: Colors.white,
                        child: Text(s.prix?.firstWhere((prix) => prix.idCarburant == 3).valeur.toString() ?? ""),
                      ),
                      const Icon(
                        Icons.location_on,
                        color: Colors.red,
                        size: 48.0,
                      ),
                    ],
                  ),
                )),
          ),
        )
        .toList();
  }

  Future<List<Station>> _getStations(LatLng position) async {
    await account.createEmailSession(email: "danp55@live.fr", password: "123456789");
    Execution result =
        await functions.createExecution(functionId: "getStationByLocation", xasync: false, data: '{"lat":${position.latitude},"lng":${position.longitude},"fuel":3}');
    if (result.status == 'completed') {
      List<dynamic> stationsMap = jsonDecode(result.response);
      setState(() {
        isStationsLoading = false;
      });
      return stationsMap.map((e) => Station.fromJson(e)).toList();
    } else {
      setState(() {
        isStationsLoading = false;
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Une erreur c'est produite.")));
      });
    }
    return [];
  }
}

class ViteMaPompeAttribution extends StatelessWidget {
  const ViteMaPompeAttribution({super.key});

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: const Color(0xCCFFFFFF),
      child: GestureDetector(
        onTap: () {/* todo open in browser*/},
        child: Padding(
          padding: const EdgeInsets.all(3),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Text('© OpenStreetMap'),
            ],
          ),
        ),
      ),
    );
  }
}

class MapControls extends StatelessWidget {
  final VoidCallback onCenter;
  final VoidCallback onZoomIn;
  final VoidCallback onZoomOut;
  const MapControls({super.key, required this.onCenter, required this.onZoomIn, required this.onZoomOut});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.bottomLeft,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Wrap(
          direction: Axis.vertical,
          spacing: 8.0,
          children: [
            ElevatedButton(
              onPressed: onZoomIn,
              style: ElevatedButton.styleFrom(shape: const CircleBorder(), padding: const EdgeInsets.all(14)),
              child: const Icon(Icons.zoom_in),
            ),
            ElevatedButton(
              onPressed: onZoomOut,
              style: ElevatedButton.styleFrom(shape: const CircleBorder(), padding: const EdgeInsets.all(14)),
              child: const Icon(Icons.zoom_out),
            ),
            ElevatedButton(
              onPressed: onCenter,
              style: ElevatedButton.styleFrom(shape: const CircleBorder(), padding: const EdgeInsets.all(14)),
              child: const Icon(Icons.location_searching),
            ),
          ],
        ),
      ),
    );
  }
}
