"use client";
import React, { useState } from "react";
import { prepareContractCall, toWei } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import TransactionButton from "./TransactionButton";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { TOKENS_CONFIG, getTokenForChain } from "../constants";
import { useDexContract } from "../lib/get-contract";
import { useChain } from "../context/ChainContext";

export default function Unwrapper() {
  const account = useActiveAccount();
  const { activeChain } = useChain();
  const [amount, setAmount] = useState<number>(0);

  // Obtenemos la configuración del token WETH según la red activa
  const wethToken = getTokenForChain(TOKENS_CONFIG.weth, activeChain.id);
  const wethContract = useDexContract({ address: wethToken.address });

  return (
    <Popover>
      {/* Botón principal para abrir el Popover */}
      <PopoverTrigger asChild>
        <Button
          className="h-full w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
          disabled={!account}
          suppressHydrationWarning
        >
          Unwrap Token
        </Button>
      </PopoverTrigger>

      {/* Contenido del Popover */}
      <PopoverContent className="w-80 bg-gray-900/95 text-white rounded-lg shadow-lg p-4 border border-gray-700">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">Desenvolver Token Nativo</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Input para la cantidad de WETH */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="0"
                type="number"
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="bg-gray-800/80 text-white border border-gray-600 rounded-md p-2 w-full"
                suppressHydrationWarning
              />
              <span className="text-gray-300">WETH</span>
            </div>

            {/* Botón de Unwrap */}
            <div className="mt-4 w-full">
              <TransactionButton
                transaction={() => {
                  const tx = prepareContractCall({
                    contract: wethContract,
                    method: "function withdraw(uint256)",
                    params: [toWei(amount.toString())],
                    value: toWei("0"),
                  });
                  return tx;
                }}
                onSent="Unwrapping your WETH..."
                onConfirmed="Successfully unwrapped WETH"
                onError="Failed to unwrap your WETH"
                successCallback={() => setAmount(0)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold py-2 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all"
              >
                Unwrap
              </TransactionButton>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}