import { SetupServer } from "../src/server";
import supertest from "supertest";

let server: SetupServer;

beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest.agent(server.getApp());
}, 20000);


afterAll(async () => await server.close(), 5000);