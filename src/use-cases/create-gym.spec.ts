import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUserCase } from "./register";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUserCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUserCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUserCase(gymsRepository);
  });

  it("Should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Javascript",
      description: null,
      phone: null,
      latitude: -7.9910637,
      longitude: -34.8950831
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
