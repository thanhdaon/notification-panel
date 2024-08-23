"use client";

import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { httpBatchLink } from "@trpc/client";
import { ReactNode, useState } from "react";
import superjson from "superjson";
import { api } from "~/trpc/client";
import { getUrl } from "~/trpc/shared";

interface Props {
  children: ReactNode;
  headers?: Headers;
}

export function TRPCReactProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { placeholderData: keepPreviousData },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [httpBatchLink({ url: getUrl(), transformer: superjson })],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}
