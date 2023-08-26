import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUserCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsErrors } from "./errors/users-already-exists-errors";

let userRepository: InMemoryUsersRepository;
let sut: RegisterUserCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new RegisterUserCase(userRepository);
  });

  it("Should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "12345",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "12345",
    });

    const isPasswordCorrectlyHashed = await compare(
      "12345",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Should be not able to register with same email twice", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "12345",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsErrors);
  });
});
