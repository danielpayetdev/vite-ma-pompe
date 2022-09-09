import { config, PoolClient } from "./deps.ts";
import { DownloadData } from "./services/download-data.ts";
import { connect } from './common/database/database.ts'; 
import { StationsRepo } from "./services/stations.repo.ts";

config({ export: true });

const data = await new DownloadData().download();

if (data) {
  const connection: PoolClient = await connect();
  try {
    const stationId: number[] = [];
    let itemSaved = 0;
    while (itemSaved <= data.length) {
      const query = await connection.queryObject<{ _id: number }>(
        StationsRepo.insertAll(data.slice(itemSaved, itemSaved + 100)),
      );
      stationId.push(...query.rows.map((o) => o._id));
      itemSaved = itemSaved + 100;
    }
    await connection.queryObject(
      StationsRepo.deleteAll(stationId),
    );
    console.log("\nDone.");
  } catch (e) {
    console.error(e.message);
    Deno.exit(1);
  } finally {
    connection.release();
  }
} else {
  console.log("Error while downloading data");
}

Deno.exit();