import { PrimaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymsUseCase() {
  const prismaGymsRepository = new PrimaGymsRepository(); 
  const useCase = new FetchNearbyGymsUseCase(prismaGymsRepository);

  return useCase;
}
