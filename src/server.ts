import dotenv from "dotenv";

import { EcomApp } from "@/app";
import logger from "@/utils/logger";
import connectDb from "@/config/dbconfig";
import runRedisOperation, { disconnectRedis } from "@/config/redis.config";

dotenv.config();

const app = new EcomApp();

const startServer = async () => {
  const Port: number | string = process.env.PORT || 4000;
  try {
    app.listen(Port, () =>
      logger.info(`Server Listening on http://localhost:${Port}`)
    );
    await runRedisOperation();
    await connectDb(process.env.MONGO_URL!);
  } catch (error: Error | any) {
    logger.error(`There was an error with the server: ${error.message}`);
    logger.error(`Error during server close: ${error.message}`);
  }
};

const shutdown = async () => {
  try {
    await app.close();
    await disconnectRedis();
    logger.info("Server closed and Redis disconnected.");
    process.exit(0);
  } catch (error: Error | any) {
    logger.error(`Error during server shutdown: ${error.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
