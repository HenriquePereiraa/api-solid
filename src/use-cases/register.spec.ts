import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { expect, describe, it } from "vitest";
import { RegisterUserCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

describe("Register Use Case", () => {
  it("Should hash user password upon registration", async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(userRepository);

    const { user } = await registerUseCase.execute({
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
});
