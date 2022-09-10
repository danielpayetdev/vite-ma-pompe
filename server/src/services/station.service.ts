import { Injectable, PoolClient } from "../deps.ts";
import { TypeCarburant } from "../common/type/type-carburant.ts";
import { Station } from "../common/type/interface/station.ts";
import { connect } from "../common/database/database.ts";
import { StationsRepo } from "./stations.repo.ts";
import { FindByLocationProcess } from "./find-by-location.ts";

/**
 * StationService is responsible for the station data.
 */
@Injectable()
export class StationService {
  public async getPrice(station: number, fuel: TypeCarburant) {
    const connection: PoolClient = (await connect())!;
    const price = (await connection.queryObject<Station>(
      StationsRepo.getFuelPriceofStation(station, fuel),
    )).rows;
    return price[0];
  }

  public async aroundPosition(
    latitude: number,
    longitude: number,
    rayon = 10,
    limit = 50,
    fuel: TypeCarburant,
  ): Promise<Station[]> {
    const connection: PoolClient = (await connect())!;
    const stations =
      (await connection.queryObject<Station>(StationsRepo.getAllByFuel(fuel)))
        .rows;
    return new FindByLocationProcess().aroundPosition(
      stations,
      latitude,
      longitude,
      rayon,
      limit,
    );
  }
}
