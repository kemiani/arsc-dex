// src/app/transactions/quote.ts
import { quoteExactInputSingle } from "thirdweb/extensions/uniswap";
import type Token from "../types/token";

type QuoteOptions = {
  tokenIn: Token;
  amount: bigint;
  tokenOut: Token;
  fee: number;
};

export default function quote(
  options: QuoteOptions,
  quoterContract: any
) {
  return quoteExactInputSingle({
    contract: quoterContract,
    tokenIn: options.tokenIn.address,
    amountIn: options.amount,
    tokenOut: options.tokenOut.address,
    fee: options.fee,
    sqrtPriceLimitX96: BigInt(0),
  });
}