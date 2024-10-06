import request from "supertest";
import { NextFunction, Request, Response, Express } from "express";
import { EcomApp } from "@/app";
import connectDb from "@/config/dbconfig";
import runRedisOperation from "@/config/redis.config";
import { __404_err_page } from "@/middlewares/notFound";
import log from "@/utils/logger";

jest.mock("@/config/dbconfig");
jest.mock("@/config/redis.config");
jest.mock("@/utils/logger");

describe("Application entery point", () => {
  let appInstance: EcomApp;

  beforeEach(() => {
    appInstance = new EcomApp();
  });

  it("should create an instance of EcomApp and setup the middlewares", () => {
    expect(appInstance).toBeInstanceOf(EcomApp);
  });

  it("should return a welcome message on root endpoint", async () => {
    const response = await request(appInstance["app"]).get("/");
    expect(response.status).toBe(308); // 308 == StatusCodes.PERMANENT_REDIRECT
    expect(response.body.message).toBe(
      "Welcome to the E-Commerce rest api application."
    );
  });

  describe("Failed routes", () => {
    it("for non-existent routes, return a status code of 404 and a message", async () => {
      const response = await request(appInstance.getApp()).get(
        "http://localhost:4040/api/v1/mall/non-existing-route"
      );

      expect(response.status).toBe(404);

      //   log.info(response.body.json);
    });
  });

  it("should call connectDb and runRedisOperation when listen is called", async () => {
    await appInstance.listen();
    expect(runRedisOperation).toHaveBeenCalled();
    expect(connectDb).toHaveBeenCalledWith(process.env.MONGO_URL);
  });
});
