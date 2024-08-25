import { $Enums } from "@prisma/client";
import { z } from "zod";
import { createRouter, publicProcedure } from "~/server/trpc";

export const notificationRouter = createRouter({
  getMany: publicProcedure.query(async ({ ctx, input }) => {
    const data = await ctx.prisma.notification.findMany({
      include: {
        comeFrom: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 100,
    });
    const total = await ctx.prisma.notification.count();
    return { total, data };
  }),
  markAsRead: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.update({
        where: {
          id: input,
        },
        data: {
          read: true,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        type: z.nativeEnum($Enums.NotificationType),
        releaseNumber: z.string().optional(),
        comeFromPersonId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "PlatformUpdate") {
        if (input.releaseNumber === undefined) {
          throw new Error("Platform update notification need a release number");
        }

        await ctx.prisma.notification.create({
          data: {
            type: $Enums.NotificationType.PlatformUpdate,
            releaseNumber: input.releaseNumber,
          },
        });

        return;
      }

      if (input.comeFromPersonId === undefined) {
        throw new Error("Notification need input an person name");
      }

      await ctx.prisma.notification.create({
        data: {
          type: input.type,
          comeFromPersonId: input.comeFromPersonId,
        },
      });
    }),
});
