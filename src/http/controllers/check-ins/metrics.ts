import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserCheckInsHistoryUseCase = makeGetUserMetricsUseCase();

  const { checkInsCounter } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkInsCounter,
  });
}
