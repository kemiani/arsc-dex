"use client";
import React, { useState } from "react";
import { prepareContractCall, toWei } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import TransactionButton from "./TransactionButton";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TOKENS_CONFIG, getTokenForChain } from "../constants";
import { useDexContract } from "../lib/get-contract";
import { useChain } from "../context/ChainContext";

export default function Wrapper() {
  const account = useActiveAccount();
  const { activeChain } = useChain();
  const [amount, setAmount] = useState<number>(0);

  // Calculamos dinámicamente el token WETH según la red activa
  const wethToken = getTokenForChain(TOKENS_CONFIG.weth, activeChain.id);
  const wethContract = useDexContract({ address: wethToken.address });

  return (
    <Popover>
      {/* Botón principal para abrir el Popover */}
      <PopoverTrigger asChild>
        <Button
          className="h-full w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold 
                     shadow-md hover:shadow-lg transition-all"
          disabled={!account}
          suppressHydrationWarning
        >
          Wrap Token
        </Button>
      </PopoverTrigger>

      {/* Contenido del Popover */}
      <PopoverContent className="w-80 bg-gray-900/95 text-white rounded-lg shadow-lg p-4 border border-gray-700">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
             Envolver Token Nativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Input para la cantidad */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="0"
                type="number"
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="bg-gray-800/80 text-white border border-gray-600 rounded-md p-2 w-full"
                suppressHydrationWarning
              />
              <span className="text-gray-300">{activeChain.symbol}</span>
            </div>

            {/* Botón de Wrap */}
            <div className="mt-4 w-full">
              <TransactionButton
                transaction={() => {
                  const tx = prepareContractCall({
                    contract: wethContract,
                    method: "function deposit()",
                    params: [],
                    value: toWei(amount.toString()),
                  });
                  return tx;
                }}
                onSent="Wrapping your tokens..."
                onConfirmed="Successfully wrapped tokens"
                onError="Failed to wrap your tokens"
                successCallback={() => setAmount(0)}
                className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white font-bold 
                           py-2 rounded-lg hover:from-green-600 hover:to-teal-500 transition-all"
              >
                Wrap
              </TransactionButton>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}