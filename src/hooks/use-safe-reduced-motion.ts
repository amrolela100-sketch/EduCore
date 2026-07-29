"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hydration-safe wrapper for Framer Motion's `useReducedMotion`.
 * Prevents Next.js SSR vs client hydration mismatches by returning `false`
 * during initial hydration render, then updating after mount.
 */
export function useSafeReducedMotion(): boolean {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return false;
  }

  return prefersReduced ?? false;
}
