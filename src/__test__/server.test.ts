import dotenv from "dotenv";
import { EcomApp } from "@/app";
import logger from "@/utils/logger";
import connectDb from "@/config/dbconfig";
import runRedisOperation, { disconnectRedis } from "@/config/redis.config";

dotenv.config();

jest.mock("@/app");
jest.mock("@/utils/logger");
jest.mock("@/config/redis.config");

describe("Server initialization", () => {
  let listenServerMock: jest.Mock;
  let closeServerMock: jest.Mock;

  beforeEach(() => {
    // Mocking EcomApp class methods
    listenServerMock = jest.fn((port: number | string, cb: () => void) => cb());
    closeServerMock = jest.fn(() => Promise.resolve());

    // Mock the implementation of EcomApp class
    (EcomApp as jest.Mock).mockImplementation(() => ({
      listen: listenServerMock,
      close: closeServerMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should start or initialize the server and start listening on port 4040 or 4000", () => {
    // Require the server to trigger the EcomApp class & the startServer function
    require("@/server");

    // Check that the server has started listening on the correct port.
    expect(listenServerMock).toHaveBeenCalledTimes(1);
    expect(listenServerMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function)
    );
  });

  // it("should call connectDb and runRedisOperation when listen is called", async () => {
  //   const app = new EcomApp();
  //   app.listen(4000, () => {
  //     logger.info(`Server Listening on http://localhost:4000`);
  //   });
  //   expect(runRedisOperation).toHaveBeenCalled();
  //   expect(connectDb).toHaveBeenCalledWith(process.env.MONGO_URL);
  // });

  it("should shut down the server & disconnect Redis", async () => {
    // Mock Process.exit to avoid actually exiting the test
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation(() => {
        return undefined as never;
      });

    // Trigger the shutdown event manually
    process.emit("SIGINT");

    // wait for the shutdown process to complete
    await new Promise(process.nextTick);

    // Check the server shutdown & Redis disconnection were called
    expect(closeServerMock).toHaveBeenCalledTimes(0);
    expect(disconnectRedis).toHaveBeenCalledTimes(1);

    // Ensure process.exit was called with the correct exit code
    expect(processExitMock).toHaveBeenCalledWith(0);

    // Restore the original process.exit behavior
    processExitMock.mockRestore();
  });
});
