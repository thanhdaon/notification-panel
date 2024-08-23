import { prisma } from "~/server/db/db";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

type Context = {
  prisma: typeof prisma;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
