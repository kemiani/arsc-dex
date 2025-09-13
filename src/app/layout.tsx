import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { SuppressHydrationWarnings } from "./suppress-hydration-warnings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARSC DEX - Decentralized Exchange",
  description: "DEX Argentino - Intercambie tokens al instante con tarifas casi nulas. Desarrollado con protocolos descentralizados.",
  keywords: "dex, defi, uniswap, ethereum, polygon, arbitrum, base, optimism, web3, swap",
  authors: [{ name: "ARSC Team" }],
  openGraph: {
    title: "ARSC DEX - Decentralized Exchange",
    description: "DEX Argentino - Intercambie tokens al instante con tarifas casi nulas.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARSC DEX - Decentralized Exchange",
    description: "DEX Argentino - Intercambie tokens al instante con tarifas casi nulas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SuppressHydrationWarnings />
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}