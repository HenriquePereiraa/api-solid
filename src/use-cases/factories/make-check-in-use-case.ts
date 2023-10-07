import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInUseCase } from "../check-in";
import { PrimaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeGetUserMetricsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository();
  const prismaGymsRepository = new PrimaGymsRepository()
  
  const useCase = new CheckInUseCase(prismaCheckInsRepository, prismaGymsRepository);

  return useCase;
}
