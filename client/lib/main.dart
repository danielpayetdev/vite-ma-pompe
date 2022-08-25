import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

void main() {
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
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<Position>(
          future: Geolocator.getCurrentPosition(
              desiredAccuracy: LocationAccuracy.bestForNavigation),
          builder: (context, snapshot) {
            return snapshot.hasData
                ? FlutterMap(
                    options: MapOptions(
                      center: LatLng(snapshot.data?.latitude ?? 0,
                          snapshot.data?.longitude ?? 0),
                      zoom: 16,
                      maxBounds: LatLngBounds(
                        LatLng(50.89, -2.00),
                        LatLng(41.24, 9.68),
                      ),
                    ),
                    layers: [
                      TileLayerOptions(
                        urlTemplate:
                            "https://api.mapbox.com/styles/v1/danielpayet974/cl76it7vn003k14o0xg952ieu/tiles/512/{z}/{x}/{y}@2x?access_token={access_token}",
                        additionalOptions: {
                          "access_token":
                              "pk.eyJ1IjoiZGFuaWVscGF5ZXQ5NzQiLCJhIjoiY2w3Nmlsem5iMDZhbjNwcGJma3FldnZ4aiJ9.ZK7lw66JWY__UzvpSX92GQ"
                        },
                      ),
                      MarkerLayerOptions(
                        rebuild: Geolocator.getPositionStream(),
                        markers: [
                          Marker(
                            point: LatLng(snapshot.data?.latitude ?? 0,
                                snapshot.data?.longitude ?? 0),
                            width: 80,
                            height: 80,
                            builder: (context) =>
                                UserMarker(angle: snapshot.data?.heading ?? 0),
                          ),
                          Marker(
                            point: LatLng(snapshot.data?.latitude ?? 0,
                                snapshot.data?.longitude ?? 0),
                            width: 80,
                            height: 80,
                            rotate: true,
                            builder: (context) => const StationMarker(),
                          ),
                        ],
                      ),
                    ],
                  )
                : const SizedBox();
          }),
    );
  }
}

class UserMarker extends StatelessWidget {
  final double angle;

  const UserMarker({
    super.key,
    required final this.angle,
  });

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(angle: angle, child: const Icon(Icons.navigation));
  }
}

class StationMarker extends StatelessWidget {
  const StationMarker({super.key});

  @override
  Widget build(BuildContext context) {
    return const Icon(Icons.local_gas_station);
  }
}
