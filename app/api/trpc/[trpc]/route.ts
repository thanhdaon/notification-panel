import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { prisma } from "~/server/db/db";
import { appRouter } from "~/server/routes";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (opts: FetchCreateContextFnOptions) => {
      return { prisma };
    },
  });

export { handler as GET, handler as POST };
