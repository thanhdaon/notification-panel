"use client";

import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "~/server/routes";

export const api = createTRPCReact<AppRouter>();
