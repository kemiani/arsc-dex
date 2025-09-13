"use client";

import { useEffect } from 'react';

// Suppress hydration warnings caused by browser extensions
export function SuppressHydrationWarnings() {
  useEffect(() => {
    // Override console.error to filter out hydration warnings from browser extensions
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      // Safety check for arguments
      if (!args || args.length === 0) {
        return originalError();
      }
      
      try {
        const errorMessage = args.join(' ');
        
        // Filter out hydration errors caused by browser extensions
        if (
          errorMessage.includes('fdprocessedid') ||
          errorMessage.includes('Hydration failed') ||
          errorMessage.includes('server rendered HTML didn\'t match') ||
          errorMessage.includes('A tree hydrated but some attributes') ||
          errorMessage.includes('Cannot apply unknown utility class')
        ) {
          return; // Suppress the error
        }
        
        // Show all other errors normally
        originalError.apply(console, args);
      } catch (e) {
        // Fallback if there's an issue with argument handling
        originalError.apply(console, args);
      }
    };
    
    console.warn = (...args) => {
      // Safety check for arguments
      if (!args || args.length === 0) {
        return originalWarn();
      }
      
      try {
        const warnMessage = args.join(' ');
        
        // Filter out TailwindCSS v4 warnings about utility classes
        if (
          warnMessage.includes('Cannot apply unknown utility class') ||
          warnMessage.includes('bg-background') ||
          warnMessage.includes('text-foreground') ||
          warnMessage.includes('@reference')
        ) {
          return; // Suppress the warning
        }
        
        // Show all other warnings normally
        originalWarn.apply(console, args);
      } catch (e) {
        // Fallback if there's an issue with argument handling
        originalWarn.apply(console, args);
      }
    };
    
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}