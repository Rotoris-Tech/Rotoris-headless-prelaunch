"use client";

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Suppress React DevTools semver validation errors
    const originalError = console.error;

    console.error = function(...args: any[]) {
      // Check if this is the React DevTools semver error
      const errorMessage = args[0]?.toString() || '';
      const stack = args[0]?.stack || new Error().stack || '';

      if (
        errorMessage.includes('Invalid argument not valid semver') ||
        errorMessage.includes('validateAndParse') ||
        stack.includes('react_devtools_backend') ||
        stack.includes('chrome-extension')
      ) {
        // Silently ignore React DevTools errors
        return;
      }

      // Pass through all other errors
      originalError.apply(console, args);
    };

    return () => {
      // Restore original on unmount
      console.error = originalError;
    };
  }, []);

  return null;
}
