import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

import logger from "@/utils/logger";

dotenv.config();

let client: RedisClientType | null = null;

const runRedisOperation = async (): Promise<RedisClientType | null> => {
  // const client: RedisClientType = createClient();

  if (!client) {
    client = createClient();
    client.on("error", (err) => {
      logger.error("Redis Client Error", err);
    });

    try {
      await client.connect();
      logger.info("Redis connected successfully");
    } catch (error) {
      logger.error("Failed to connect to Redis:", error);
      client = null;
    }
  }
  return client;
};

export const disconnectRedis = async (): Promise<void> => {
  if (client) {
    await client.disconnect();
    logger.info("Redis disconnected successfully");
    client = null;
  }
};

export default runRedisOperation;
