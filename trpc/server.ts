import { prisma } from "~/server/db/db";
import { appRouter } from "~/server/routes";
import { createCallerFactory } from "~/server/trpc";

const createCaller = createCallerFactory(appRouter);
export const api = createCaller({ prisma });
