import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/createAndAuthenticateUser";

describe("Create gym (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript gym",
        description: "some description",
        phone: "1199999999",
        latitude: -7.9910637,
        longitude: -34.8950831,
      });

    expect(response.statusCode).toEqual(201);
  });
});
