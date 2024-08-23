import { notificationRouter as notifications } from "~/server/routes/notification";
import { personRouter as people } from "~/server/routes/person";
import { createRouter } from "~/server/trpc";

export const appRouter = createRouter({
  people,
  notifications,
});

export type AppRouter = typeof appRouter;
