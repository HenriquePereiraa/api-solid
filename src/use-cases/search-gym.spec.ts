import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

let checkInsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(checkInsRepository);
  });

  it("Should be able to search for gyms", async () => {
    await checkInsRepository.create({
      title: "Javascript gym",
      description: null,
      phone: null,
      latitude: -7.9910637,
      longitude: -34.8950831,
    });

    await checkInsRepository.create({
      title: "Typescript gym",
      description: null,
      phone: null,
      latitude: -7.9910637,
      longitude: -34.8950831,
    });

    const { gyms } = await sut.execute({
      query: "Javascript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript gym" }),
    ]);
  });

  it.skip("Should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        title: `Typescript gym - ${i}`,
        description: null,
        phone: null,
        latitude: -7.9910637,
        longitude: -34.8950831,
      });
    }

    const { gyms } = await sut.execute({
      query:"Typescript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Typescript - 21" }),
      expect.objectContaining({ title: "Typescript - 22" }),
    ]);
  });
});
