import { PrimaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUserCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrimaGymsRepository(); 
  const useCase = new CreateGymUserCase(prismaGymsRepository);

  return useCase;
}
