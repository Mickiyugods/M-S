"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { WalletProvider } from "@/lib/web3";
import HashlessScroll from "@/components/HashlessScroll";

/** Framer Motion honours the OS "reduce motion" setting across the whole site. */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <HashlessScroll />
      <WalletProvider>{children}</WalletProvider>
    </MotionConfig>
  );
}
