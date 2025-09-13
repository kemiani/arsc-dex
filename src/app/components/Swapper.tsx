"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { type Address, toTokens, toUnits } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Loader2Icon, ArrowDown, AlertTriangle } from "lucide-react";
import { useApprove } from "../transactions/approve";
import swap from "../transactions/swap";
import { TOKENS_CONFIG, getTokenForChain, getContractAddresses } from "../constants";
import { useChain } from "../context/ChainContext";
import TransactionButton from "./TransactionButton";
import TokenSelect from "./TokenSelect";
import type Token from "../types/token";
import useQuote from "../hooks/useQuote";
import { cn } from "../lib/utils";
import { allowance as thirdwebAllowance, balanceOf } from "thirdweb/extensions/erc20";
import { useDexContract } from "../lib/get-contract";
import ConnectButton from "./ConnectButton";
import SlippageSettings from "./SlippageSettings";
import Wrapper from "./Wrapper";
import Unwrapper from "./Unwrapper";
import { useDexContracts } from "../lib/useDexContracts";
import { useSlippage } from "../context/SlippageContext";

//
// Funciones auxiliares
//
const fetchAllowance = async (
  tokenIn: Token,
  recipient: Address,
  tokenContract: ReturnType<typeof useDexContract>,
  spender: `0x${string}`
) => {
  return thirdwebAllowance({
    contract: tokenContract,
    owner: recipient,
    spender,
  });
};

const fetchBalance = async (
  tokenIn: Token,
  recipient: Address,
  tokenContract: ReturnType<typeof useDexContract>
) => {
  return balanceOf({
    contract: tokenContract,
    address: recipient,
  });
};

//
// Componente SwapButton
//
function SwapButton({
  tokenIn,
  tokenOut,
  amount,
  fee,
  recipient,
  balance,
  refetchBalance,
  routerContract,
  expectedOutput,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amount: bigint;
  fee: number;
  recipient: Address;
  balance: bigint;
  refetchBalance: () => Promise<void>;
  routerContract: any;
  expectedOutput: bigint;
}) {
  const { activeChain } = useChain();
  const { getEffectiveSlippage } = useSlippage();
  const { ROUTER } = getContractAddresses(activeChain.id);
  
  // Calcular slippage efectivo
  const swapSizeUSD = Number(toTokens(amount, tokenIn.decimals)) * 1; // Asumimos $1 por token como aproximación
  const effectiveSlippage = getEffectiveSlippage(tokenIn.symbol, tokenOut.symbol, swapSizeUSD);
  const tokenContract = useDexContract({ address: tokenIn.address });
  const [allowance, setAllowance] = useState(BigInt(0));

  const refetchAllowance = useCallback(
    () =>
      fetchAllowance(tokenIn, recipient, tokenContract, ROUTER as `0x${string}`).then(
        setAllowance
      ),
    [tokenIn, recipient, tokenContract, ROUTER]
  );

  useEffect(() => {
    refetchAllowance();
  }, [tokenIn, recipient, refetchAllowance]);

  // Obtenemos la función de aprobación usando el hook useApprove (llamada incondicionalmente)
  const approveTx = useApprove({
    token: tokenIn,
    amount,
    spender: ROUTER as `0x${string}`,
  });

  if (balance < amount) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col text-center bg-red-900/20 p-4 rounded-xl border border-red-500/30 backdrop-blur-lg"
      >
        <div className="font-semibold text-red-300 text-sm sm:text-base">
          Not enough {tokenIn.symbol}!
        </div>
        <div className="text-xs sm:text-sm text-red-400/60 mt-1">
          Your balance: {toTokens(balance, tokenIn.decimals)}
        </div>
      </motion.div>
    );
  }

  if (allowance < amount) {
    return (
      <TransactionButton
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 border border-blue-400/30 transform hover:scale-[1.02] active:scale-[0.98]"
        transaction={approveTx}
        onSent="Approving tokens..."
        onConfirmed="Tokens approved successfully!"
        onError="Failed to approve tokens"
        successCallback={refetchAllowance}
      >
        Approve {tokenIn.symbol}
      </TransactionButton>
    );
  }

  return (
    <TransactionButton
      className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-sky-500/30 border border-sky-400/30 transform hover:scale-[1.02] active:scale-[0.98]"
      transaction={() =>
        swap(
          {
            inputToken: tokenIn,
            inputAmount: amount,
            outputToken: tokenOut,
            expectedOutput,
            recipient,
            fee,
            slippagePercent: effectiveSlippage,
          },
          routerContract
        )
      }
      onSent="Processing swap..."
      onConfirmed="Swap successful!"
      onError="Swap failed"
      successCallback={refetchBalance}
    >
      Swap
    </TransactionButton>
  );
}

//
// Componente principal Swapper
//
export default function Swapper() {
  const { activeChain } = useChain();
  const { routerContract } = useDexContracts();
  const account = useActiveAccount();
  const [inputTokenKey, setInputTokenKey] = useState<string | undefined>(undefined);
  const [outputTokenKey, setOutputTokenKey] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(BigInt(0));

  // En lugar de usar un objeto TOKENS fijo, usamos TOKENS_CONFIG y getTokenForChain para obtener
  // la dirección del token según el chain activo.
  const inputToken = useMemo(() => {
    if (!inputTokenKey) return undefined;
    const tokenConfig = TOKENS_CONFIG[inputTokenKey];
    return tokenConfig ? getTokenForChain(tokenConfig, activeChain.id) : undefined;
  }, [inputTokenKey, activeChain.id]);

  const outputToken = useMemo(() => {
    if (!outputTokenKey) return undefined;
    const tokenConfig = TOKENS_CONFIG[outputTokenKey];
    return tokenConfig ? getTokenForChain(tokenConfig, activeChain.id) : undefined;
  }, [outputTokenKey, activeChain.id]);

  const { loading: quoteLoading, fee, outputAmount } = useQuote({
    tokenIn: inputToken,
    tokenOut: outputToken,
    amount: toUnits(amount || "0", inputToken?.decimals ?? 18),
  });

  const tokenInContract = useDexContract({
    address: inputToken ? (inputToken.address as `0x${string}`) : ("0x0000000000000000000000000000000000000000" as `0x${string}`),
  });

  const refetchBalance = useCallback(async () => {
    if (inputToken && account && tokenInContract) {
      const newBalance = await fetchBalance(inputToken, account.address as Address, tokenInContract);
      setBalance(newBalance);
    }
  }, [inputToken, account, tokenInContract]);

  useEffect(() => {
    refetchBalance();
  }, [inputToken, account, refetchBalance]);

  const handleMaxClick = useCallback(() => {
    if (inputToken) {
      setAmount(toTokens(balance, inputToken.decimals).toString());
    }
  }, [balance, inputToken]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const canSwap = !quoteLoading && account && inputToken && outputToken && Number(amount) > 0 && fee;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 relative">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card className="border-0 bg-gray-900/90 backdrop-blur-2xl rounded-3xl relative shadow-2xl shadow-blue-900/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 pointer-events-none" />
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <CardTitle className="text-xl font-bold text-white">Swap Tokens</CardTitle>
              <div className="flex items-center gap-2">
                <SlippageSettings />
                <ConnectButton />
              </div>
            </div>
            <motion.div className="flex gap-3" layout>
              <motion.div
                className="flex-1 relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative bg-gray-800/50 rounded-xl p-3 border border-white/10 h-full flex items-center justify-center">
                  <Wrapper />
                </div>
              </motion.div>
              <motion.div
                className="flex-1 relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative bg-gray-800/50 rounded-xl p-3 border border-white/10 h-full flex items-center justify-center">
                  <Unwrapper />
                </div>
              </motion.div>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 relative z-10">
            <motion.div
              className="relative group"
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="relative p-4 bg-gray-800/40 hover:bg-gray-800/60 rounded-2xl backdrop-blur-lg border border-white/10 transition-all duration-300">
                {inputToken && account && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">
                      Balance: {toTokens(balance, inputToken.decimals)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMaxClick}
                      className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 rounded-lg"
                    >
                      MAX
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="bg-transparent border-0 text-2xl font-semibold text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 flex-1"
                  />
                  <TokenSelect
                    selectedKey={inputTokenKey}
                    onSelect={setInputTokenKey}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 min-w-[120px] transition-colors font-medium"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div className="flex justify-center relative" layout>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <button
                  type="button"
                  className="p-2 bg-gray-800 border-2 border-gray-700 rounded-xl hover:bg-gray-700/50 transition-colors hover:border-cyan-400/50 hover:-translate-y-0.5"
                  onClick={() => {
                    const temp = inputTokenKey;
                    setInputTokenKey(outputTokenKey);
                    setOutputTokenKey(temp);
                  }}
                  suppressHydrationWarning
                >
                  <ArrowDown className="w-5 h-5 text-cyan-400" />
                </button>
              </div>
            </motion.div>
            <motion.div
              className="relative group"
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="relative p-4 bg-gray-800/40 hover:bg-gray-800/60 rounded-2xl backdrop-blur-lg border border-white/10 transition-all duration-300">
                <div className={cn("flex items-center gap-3", quoteLoading && "animate-pulse")}>
                  <div className="flex-1 text-2xl font-semibold text-white min-w-0">
                    {quoteLoading ? (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Loader2Icon className="animate-spin w-6 h-6" />
                        <span>Calculating...</span>
                      </div>
                    ) : (
                      outputToken && toTokens(outputAmount || BigInt(0), outputToken.decimals)
                    )}
                  </div>
                  <TokenSelect
                    selectedKey={outputTokenKey}
                    onSelect={setOutputTokenKey}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 min-w-[120px] transition-colors font-medium"
                  />
                </div>
              </div>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={canSwap ? "swap" : "connect"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pt-2"
              >
                {canSwap ? (
                  <SwapButton
                    fee={fee}
                    recipient={account.address as Address}
                    tokenIn={inputToken!}
                    tokenOut={outputToken!}
                    amount={toUnits(amount, inputToken?.decimals ?? 18)}
                    expectedOutput={outputAmount || BigInt(0)}
                    balance={balance}
                    refetchBalance={refetchBalance}
                    routerContract={routerContract}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-dashed border-gray-600">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <span className="text-gray-300 text-center">
                      {!account
                        ? "Connect wallet to swap"
                        : "Select tokens and enter amount"}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-400/30 rounded-full blur-2xl animate-float-delayed" />
      </div>
    </div>
  );
}