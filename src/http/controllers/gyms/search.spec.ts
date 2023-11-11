import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/createAndAuthenticateUser";

describe("Search gyms (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to search a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript gym",
        description: "some description",
        phone: "1199999999",
        latitude: -7.9910637,
        longitude: -34.8950831,
      });

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript gym",
        description: "some description",
        phone: "1199999999",
        latitude: -7.9910637,
        longitude: -34.8950831,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({
        query: "JavaScript",
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript gym",
      }),
    ]);
  });
});
