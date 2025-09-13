"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Swapper from "./components/Swapper";

// Generate fixed seed for consistent animations
const generateParticleConfig = (index: number) => {
  // Use index as seed for consistent values
  const seed = (index * 2654435761) % Math.pow(2, 32);
  const random1 = ((seed / Math.pow(2, 32)) * 100) % 100;
  const random2 = (((seed * 1103515245 + 12345) / Math.pow(2, 32)) * 100) % 100;
  const random3 = (((seed * 16807) / Math.pow(2, 32)) * 4 + 4) % 8 + 2;
  
  return {
    x: random1 + "%",
    y: random2 + "%",
    duration: random3,
  };
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#030712] to-[#111827] min-h-screen font-mono">
      {/* Header/Navbar */}
      <Header />

      {/* Efectos de fondo mejorados */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vh] bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vh] bg-cyan-400/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/3 w-[50vw] h-[50vh] bg-indigo-600/10 rounded-full blur-3xl animate-float" />
      </div>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 pt-8 tracking-tight bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent drop-shadow-2xl"
          >
            DEX Argentino
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mt-4 flex items-center justify-center gap-2"
          >
            Intercambie tokens al instante con tarifas casi nulas
            <img
              src="https://raw.githubusercontent.com/ChainSafe/uniswap-frontend/refs/heads/beta/public/favicon.ico"
              alt="Uniswap Icon"
              className="w-5 h-5"
            />
          </motion.p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Swapper />
        </motion.div>

        {/* Información adicional */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">5</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Chain</h3>
            <p className="text-gray-400 text-sm">
              Soporta Ethereum, Polygon, Optimism, Arbitrum y Base
            </p>
          </div>

          <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Uniswap V3</h3>
            <p className="text-gray-400 text-sm">
              Mejor liquidez y precios optimizados
            </p>
          </div>

          <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">🔓</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Open Source</h3>
            <p className="text-gray-400 text-sm">
              Código abierto y transparente para la comunidad
            </p>
          </div>
        </motion.div>

        {/* Efectos decorativos adicionales */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-20 right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute bottom-40 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow-delayed" />
        </div>
      </main>

      {/* Efecto de partículas interactivas */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const config = generateParticleConfig(i);
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                initial={{
                  x: config.x,
                  y: config.y,
                }}
                animate={{
                  x: ["0%", "10%", "0%"],
                  y: ["0%", "20%", "0%"],
                }}
                transition={{
                  duration: config.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}