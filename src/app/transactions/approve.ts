// src/app/transactions/approve.ts
import { useCallback } from "react";
import { approve as thirdwebApprove } from "thirdweb/extensions/erc20";
import type Token from "../types/token";
import { Address } from "thirdweb";
import { useDexContract } from "../lib/get-contract";

type ApproveOptions = {
  token: Token;
  amount: bigint;
  spender: Address;
};

export function useApprove(options: ApproveOptions) {
  const tokenContract = useDexContract({ address: options.token.address });
  return useCallback(() => {
    return thirdwebApprove({
      contract: tokenContract,
      spender: options.spender,
      amountWei: options.amount,
    });
  }, [tokenContract, options.spender, options.amount]);
}