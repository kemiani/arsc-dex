"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "./client";
import { ChainProvider } from "./context/ChainContext";
import { SlippageProvider } from "./context/SlippageContext";
import type { ReactNode } from "react";

// Configuración de react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <ChainProvider client={client}>
          <SlippageProvider>
            {children}
          </SlippageProvider>
        </ChainProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}