import { createRouter, publicProcedure } from "~/server/trpc";

export const personRouter = createRouter({
  getMany: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.person.findMany();
    const total = await ctx.prisma.person.count();
    return { total, data };
  }),
});
