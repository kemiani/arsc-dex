// src/app/lib/useDexContracts.ts
import { useChain } from "@/app/context/ChainContext";
import { getContractAddresses } from "../constants";
import { useDexContract } from "./get-contract";

export function useDexContracts() {
  const { activeChain } = useChain();
  
  if (!activeChain || !activeChain.id) {
    console.log('useDexContracts - activeChain not ready:', activeChain);
    return { 
      routerContract: null, 
      factoryContract: null, 
      quoterContract: null 
    };
  }
  
  const { ROUTER, FACTORY, QUOTER } = getContractAddresses(activeChain.id);
  const routerContract = useDexContract({ address: ROUTER });
  const factoryContract = useDexContract({ address: FACTORY });
  const quoterContract = useDexContract({ address: QUOTER });
  return { routerContract, factoryContract, quoterContract };
}