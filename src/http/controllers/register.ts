import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUserCase } from "@/use-cases/register";
import { UserAlreadyExistsErrors } from "@/use-cases/errors/users-already-exists-errors";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUserCase = new RegisterUserCase(prismaUsersRepository);

    await registerUserCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsErrors) {
      return reply.status(409).send({ message: error.message });
    }

    return reply.status(500).send();
  }

  return reply.status(201).send();
}
