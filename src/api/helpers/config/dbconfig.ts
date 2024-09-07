import mongoose from "mongoose";
import logger from "@/utils/logger";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    logger.info(`Connected to the Database!`);
  } catch (error: any) {
    logger.error(error.message);
  }
};

export default connectDB;
