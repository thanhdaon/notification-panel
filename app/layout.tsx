import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "~/components/theme-provider";
import { SiteHeader } from "~/components/site-header";
import { TRPCReactProvider } from "~/components/provider-trpc";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Notification panel",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <SiteHeader />
            {children}
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
