import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/createAndAuthenticateUser";

describe("Nearby gyms (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript gym",
        description: "some description",
        phone: "1199999999",
        latitude: -7.9916204,
        longitude: -34.9035869,
      });

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript gym",
        description: "some description",
        phone: "1199999999",
        latitude: -8.1094272,
        longitude: -34.9135731,
      });


    const response = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: "-7.9916204",
        longitude: "-34.9035869",
      })
      .send();

    expect(response.statusCode).toEqual(201);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript gym",
      }),
    ]);
    
  });
});
