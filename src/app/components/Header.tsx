"use client";

import React from "react";
import { motion } from "framer-motion";
import ConnectButton from "./ConnectButton";
import { ChainSelector } from "./ChainSelector";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-50 w-full border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <img 
              src="/images/arsc-logo.png" 
              alt="ARSC Logo" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ARSC DEX
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Exchange Descentralizado
              </p>
            </div>
          </motion.div>


          {/* Chain Selector + Connect Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <ChainSelector />
            <ConnectButton />
          </motion.div>
        </div>
      </div>

    </motion.header>
  );
}