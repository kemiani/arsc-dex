// src/app/transactions/swap.ts
import type Token from "../types/token";
import { Address, PreparedTransaction } from "thirdweb";
import { exactInputSingle } from "thirdweb/extensions/uniswap";
import { calculateMinimumOutput } from "../config/slippage";

type SwapOptions = {
  inputToken: Token;
  inputAmount: bigint;
  outputToken: Token;
  expectedOutput: bigint;
  recipient: Address;
  fee: number;
  slippagePercent: number;
  deadline?: bigint;
};

/**
 * La función swap espera que se le inyecte la instancia del contrato del Router.
 * Esto permite que, en vez de pasar una dirección, se pase un contrato completo (ThirdwebContract).
 * 
 * PROTECCIÓN ANTI-MEV:
 * - amountOutMinimum ahora se calcula basado en slippage real
 * - deadline corto para reducir ventana de ataque
 * - Validación de parámetros de entrada
 */
export default function swap(
  options: SwapOptions,
  routerContract: any // Idealmente tiparla según tu instancia de ThirdwebContract
): PreparedTransaction {
  // Calcular minimum output con protección de slippage
  const amountOutMinimum = calculateMinimumOutput(
    options.expectedOutput, 
    options.slippagePercent
  );

  // Deadline conservador (máximo 5 minutos)
  const defaultDeadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5);
  const deadline = options.deadline ?? defaultDeadline;

  // Validaciones de seguridad
  if (options.inputAmount <= BigInt(0)) {
    throw new Error("Input amount must be greater than 0");
  }

  if (options.slippagePercent < 0.01 || options.slippagePercent > 50) {
    throw new Error("Slippage must be between 0.01% and 50%");
  }

  console.log(`🛡️ Swap Protection:`, {
    inputAmount: options.inputAmount.toString(),
    expectedOutput: options.expectedOutput.toString(),
    minimumOutput: amountOutMinimum.toString(),
    slippage: `${options.slippagePercent}%`,
    protection: `${((Number(options.expectedOutput - amountOutMinimum) / Number(options.expectedOutput)) * 100).toFixed(2)}%`
  });

  return exactInputSingle({
    contract: routerContract,
    params: {
      tokenIn: options.inputToken.address,
      tokenOut: options.outputToken.address,
      fee: options.fee,
      recipient: options.recipient,
      deadline,
      amountIn: options.inputAmount,
      amountOutMinimum, // ⚡ REAL PROTECTION - No más BigInt(0)
      sqrtPriceLimitX96: BigInt(0),
    },
  });
}