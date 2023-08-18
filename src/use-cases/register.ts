import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsErrors } from "./errors/users-already-exists-errors";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithTheSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithTheSameEmail) {
      throw new UserAlreadyExistsErrors();
    }

    await this.usersRepository.create({ name, email, password_hash });
  }
}
