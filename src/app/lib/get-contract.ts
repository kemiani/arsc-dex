// src/app/lib/get-contract.ts
import { Address, getContract as thirdwebGetContract, Chain } from "thirdweb";
import { client } from "@/app/client";
import { useChain } from "@/app/context/ChainContext";

type GetContractOptions = {
  address: Address;
  chain?: Chain;
};

export function useDexContract(options: GetContractOptions) {
  const { activeChain } = useChain();
  return thirdwebGetContract({
    client,
    chain: options.chain ?? activeChain.chain,
    address: options.address,
  });
}