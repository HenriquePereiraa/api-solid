import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-id',
      title: "Javascript",
      description: null,
      phone: null,
      latitude: -7.9910637,
      longitude: -34.8950831
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -7.9910637,
      userLongitude: -34.8950831,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0)); // Date mocking
    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -7.9910637,
      userLongitude: -34.8950831,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: -7.9910637,
        userLongitude: -34.8950831,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should be able to check in twice but in the different day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0));
    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -7.9910637,
      userLongitude: -34.8950831,
    });

    vi.setSystemTime(new Date(2023, 0, 21, 9, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -7.9910637,
      userLongitude: -34.8950831,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: " Js Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-7.9952054),
      longitude: new Decimal(-34.8938056),
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-02",
        userLatitude: -7.9910637,
        userLongitude: -34.8950831,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
