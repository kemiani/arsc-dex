"use client";

import React, { useEffect, useState } from "react";
import {
  ConnectButton as ThirdwebConnectButton,
  TokenSymbol,
  TokenProvider,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useChain } from "@/app/context/ChainContext";

export default function ConnectButton() {
  const { activeChain, client } = useChain();
  const [mounted, setMounted] = useState(false);

  // Solo en el cliente, después del mount, se actualiza mounted a true
  useEffect(() => {
    setMounted(true);
  }, []);

  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  const supportedTokens = {
    1: [
      {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        name: "WETH",
        symbol: "WETH",
        icon: "https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332",
      },
      {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        name: "USDC",
        symbol: "USDC",
        icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
      },
    ],
    10: [
      {
        address: "0x4200000000000000000000000000000000000006",
        name: "WETH",
        symbol: "WETH",
        icon: "https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332",
      },
      {
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        name: "USDC",
        symbol: "USDC",
        icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
      },
      {
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        name: "USDT",
        symbol: "USDT",
        icon: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
      },
    ],
    137: [
      {
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        name: "WETH",
        symbol: "WETH", 
        icon: "https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332",
      },
      {
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        name: "USDC",
        symbol: "USDC",
        icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
      },
    ],
  };

  return (
    <TokenProvider
      address="0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
      chain={activeChain.chain}
      client={client}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <ThirdwebConnectButton
          client={client}
          theme="dark"
          locale="es_ES"
          connectButton={{
            label: "🦊 Conectar Wallet",
            className:
              "!bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !rounded-full !px-3 sm:!px-4 !py-2 !text-xs sm:!text-sm !font-medium !transition-all !duration-300 !shadow-md hover:!shadow-cyan-500/25 !text-white !border-0 !w-auto !whitespace-nowrap",
          }}
          connectModal={{
            title: "ARSC DEX",
            size: "wide",
          }}
          detailsButton={{
            className:
              "!bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !rounded-full !px-3 sm:!px-4 !py-2 !text-xs sm:!text-sm !font-medium !transition-all !duration-300 !shadow-md hover:!shadow-cyan-500/25 !text-white !border-0 !w-auto !whitespace-nowrap",
          }}
          supportedTokens={supportedTokens}
          wallets={wallets}
          onConnect={(wallet) => {
            console.log("Wallet conectada:", wallet);
          }}
        />
      </div>
    </TokenProvider>
  );
}