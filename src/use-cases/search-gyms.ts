import { hash } from "bcryptjs";
import { UserAlreadyExistsErrors } from "./errors/users-already-exists-errors";
import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsUseCaseRequest {
    query: string,
    page: number
}

interface SearchGymsUseCaseRequestResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    query,
    page
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseRequestResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)

    return {
      gyms,
    };
  }
}
