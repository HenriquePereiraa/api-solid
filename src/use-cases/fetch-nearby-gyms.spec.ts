import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let GymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use case", () => {
  beforeEach(async () => {
    GymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(GymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await GymsRepository.create({
      title: "Near gym",
      description: null,
      phone: null,
      latitude: -7.9916204,
      longitude: -34.9035869,
    });

    await GymsRepository.create({
      title: "Far gym",
      description: null,
      phone: null,
      latitude: -8.1094272,
      longitude: -34.9135731,
    });

    const { gyms } = await sut.execute({
      userLatitude: -7.9916204,
      userLongitude: -34.9035869,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near gym" })]);
  });
});
