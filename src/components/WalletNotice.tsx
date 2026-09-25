"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sprout, X } from "lucide-react";
import { useEffect } from "react";
import { useWallet } from "@/lib/web3";

/** Small toast that surfaces wallet status messages (e.g. "available at launch"). */
export default function WalletNotice() {
  const { message, clearMessage } = useWallet();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clearMessage, 4500);
    return () => clearTimeout(t);
  }, [message, clearMessage]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="glass glass-blur pointer-events-auto flex max-w-md items-center gap-3 !rounded-full py-2.5 pl-3 pr-2"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lime text-ink">
              <Sprout aria-hidden className="size-5" />
            </span>
            <p className="text-sm font-semibold text-cream">{message}</p>
            <button
              type="button"
              onClick={clearMessage}
              aria-label="Dismiss"
              className="grid size-9 shrink-0 place-items-center rounded-full text-cream/70 hover:bg-white/10 hover:text-white"
            >
              <X aria-hidden className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
