import { type Chain, ethereum, polygon, optimism, arbitrum, base } from "thirdweb/chains"

export interface SupportedChain {
  rpc?: string
  id: number
  name: string
  chain: Chain
  icon: string
  symbol: string
  explorer: string
}

export const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    id: ethereum.id,
    name: "Ethereum",
    chain: ethereum,
    icon: "/native-token-icons/eth.png",
    symbol: "ETH",
    explorer: "https://etherscan.io",
  },
  {
    id: polygon.id,
    name: "Polygon",
    chain: polygon,
    icon: "/native-token-icons/polygon.svg",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
  },
  {
    id: optimism.id,
    name: "Optimism",
    chain: optimism,
    icon: "/native-token-icons/op.png",
    symbol: "ETH",
    explorer: "https://optimistic.etherscan.io",
  },
  {
    id: arbitrum.id,
    name: "Arbitrum",
    chain: arbitrum,
    icon: "/native-token-icons/arbitrum.png",
    symbol: "ETH",
    explorer: "https://arbiscan.io",
  },
  {
    id: base.id,
    name: "Base",
    chain: base,
    icon: "/native-token-icons/base.png",
    symbol: "ETH",
    explorer: "https://basescan.org",
  },
]

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0]