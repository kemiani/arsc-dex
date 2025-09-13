// src/app/constants.ts
import Token from "./types/token";

/**
 * Configuración multichain para tokens.
 * Cada token se define con su símbolo, decimales, imagen y direcciones específicas por chainId.
 */
export type TokenConfig = {
  symbol: string;
  decimals: number;
  image: string;
  addresses: {
    [chainId: number]: `0x${string}`;
  };
};

export const TOKENS_CONFIG: Record<string, TokenConfig> = {
  weth: {
    symbol: "WETH",
    decimals: 18,
    image:
      "https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332",
    addresses: {
      1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Ethereum
      10: "0x4200000000000000000000000000000000000006", // Optimism
      137: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Polygon (WETH en Polygon)
      8453: "0x4200000000000000000000000000000000000006", // Base
      42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // Arbitrum
    },
  },
  wbtc: {
    symbol: "WBTC",
    decimals: 8,
    image: "/native-token-icons/wbtc.svg",
    addresses: {
      1: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // Ethereum
      10: "0x68f180fcce6836688e9084f035309e29bf0a2095", // Optimism
      137: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", // Polygon
      8453: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c", // Base
      42161: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", // Arbitrum
    },
  },
  usdc: {
    symbol: "USDC",
    decimals: 6,
    image:
      "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
    addresses: {
      1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Ethereum
      10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // Optimism
      137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // Polygon
      8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base
      42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // Arbitrum
    },
  },
  usdt: {
    symbol: "USDT",
    decimals: 6,
    image:
      "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
    addresses: {
      1: "0xdac17f958d2ee523a2206206994597c13d831ec7", // Ethereum
      10: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", // Optimism
      137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon
      8453: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", // Base
      42161: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // Arbitrum
    },
  },
};

/**
 * Helper para obtener la configuración de un token para un chain específico.
 */
export function getTokenForChain(
  tokenConfig: TokenConfig,
  chainId: number
): Token {
  return {
    ...tokenConfig,
    address: tokenConfig.addresses[chainId] || tokenConfig.addresses[1],
  };
}

/**
 * Configuración de contratos DEX (Uniswap V3) por red.
 */
export const CONTRACT_ADDRESSES: {
  [chainId: number]: {
    ROUTER: `0x${string}`;
    UNIVERSAL_ROUTER: `0x${string}`; // Para fees con PAY_PORTION
    FACTORY: `0x${string}`;
    QUOTER: `0x${string}`;
  };
} = {
  // Ethereum (ChainId: 1)
  1: {
    ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNIVERSAL_ROUTER: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", // Universal Router V1.2
    FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTER: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  },
  // Optimism (ChainId: 10)
  10: {
    ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNIVERSAL_ROUTER: "0xCb1355ff08Ab38bBCE60111F1bb2B784bE25D7e8", // Universal Router V1.2
    FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTER: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  },
  // Polygon (ChainId: 137)
  137: {
    ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNIVERSAL_ROUTER: "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5", // Universal Router V1.2
    FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTER: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  },
  // Arbitrum (ChainId: 42161)
  42161: {
    ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNIVERSAL_ROUTER: "0x5E325eDA8064b456f4781070C0738d849c824258", // Universal Router V1.2
    FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTER: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  },
  // Base (ChainId: 8453)
  8453: {
    ROUTER: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    UNIVERSAL_ROUTER: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", // Universal Router V1.2
    FACTORY: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
    QUOTER: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
  },
};

export function getContractAddresses(chainId: number) {
  if (!CONTRACT_ADDRESSES[chainId]) {
    throw new Error(
      `No se encontraron configuraciones para el chainId ${chainId}`
    );
  }
  return CONTRACT_ADDRESSES[chainId];
}