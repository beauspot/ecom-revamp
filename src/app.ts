import dotenv from "dotenv";
import logger from "@/utils/logger";
import createServer from "@/server";
import connectDb from "@/config/dbconfig";
import runRedisOperation from "@/config/redis.config";


dotenv.config();
// const MongoDBStore = MongodbSession(session);

const app = createServer();
const Port: number | string = process.env.PORT || 4000;

app.listen(Port, async () => {
  await connectDb(process.env.MONGO_URL!);
  await runRedisOperation();
  logger.info(`App is running at http://localhost:${Port}`);
  logger.info(`Documentation available at http://localhost:4040/api/v1/mall/docs`)
});
