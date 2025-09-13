// src/app/hooks/useQuote.ts
import { useChain } from "../context/ChainContext";
import { getContractAddresses } from "../constants";
import { useDexContract } from "../lib/get-contract";
import { bigIntMax } from "../lib/utils";
import quote from "../transactions/quote";
import type Token from "../types/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { simulateTransaction } from "thirdweb";
import { GetUniswapV3PoolResult, getUniswapV3Pool } from "thirdweb/extensions/uniswap";

const poolCache = new Map<string, GetUniswapV3PoolResult[]>();

export default function useQuote({
  tokenIn,
  amount,
  tokenOut,
}: {
  tokenIn?: Token;
  tokenOut?: Token;
  amount?: bigint;
}) {
  const { activeChain } = useChain();
  const { FACTORY, QUOTER } = getContractAddresses(activeChain.id);
  const factoryContract = useDexContract({ address: FACTORY });
  const quoterContract = useDexContract({ address: QUOTER });

  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState<number | undefined>();
  const [outputAmount, setOutputAmount] = useState<bigint | undefined>();

  useEffect(() => {
    const refreshQuote = async (tokenIn: Token, tokenOut: Token, amount: bigint) => {
      const loadingTimer = setTimeout(() => setLoading(true), 500);
      const key = `${tokenIn.address}:${tokenOut.address}`;
      let pools: GetUniswapV3PoolResult[] | undefined = poolCache.get(key);
      if (!pools) {
        pools = await getUniswapV3Pool({
          contract: factoryContract,
          tokenA: tokenIn.address,
          tokenB: tokenOut.address,
        });
        poolCache.set(key, pools);
      }

      if (!pools || pools.length === 0) {
        toast.error("No path found for this token pair", { duration: 5000, id: "no-path" });
        clearTimeout(loadingTimer);
        return {};
      }

      const results: bigint[] = await Promise.all(
        pools.map(async (pool: GetUniswapV3PoolResult) => {
          const quoteTx = quote(
            {
              tokenIn,
              tokenOut,
              amount,
              fee: pool.poolFee,
            },
            quoterContract
          );
          try {
            return await simulateTransaction({ transaction: quoteTx });
          } catch (e) {
            return BigInt(0);
          }
        })
      );

      const expectedOutput = bigIntMax(...results);
      const bestPoolIdx = results.findIndex((a) => a === expectedOutput);
      const bestFee = pools[bestPoolIdx]?.poolFee;

      if (!expectedOutput || bestFee === undefined) {
        toast.error("No path found for this token pair", { duration: 5000, id: "no-path" });
        clearTimeout(loadingTimer);
        return {};
      }

      clearTimeout(loadingTimer);
      return {
        expectedOutput,
        fee: bestFee,
      };
    };

    const delayExecId = setTimeout(() => {
      if (tokenIn && tokenOut && amount) {
        refreshQuote(tokenIn, tokenOut, amount)
          .then(({ expectedOutput, fee: bestFee }) => {
            setFee(bestFee);
            setOutputAmount(expectedOutput);
          })
          .finally(() => setLoading(false));
      } else {
        setFee(undefined);
        setOutputAmount(undefined);
      }
    }, 500);
    return () => clearTimeout(delayExecId);
  }, [tokenIn, amount, tokenOut, factoryContract, quoterContract]);

  return { loading, fee, outputAmount };
}