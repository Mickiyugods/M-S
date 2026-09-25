"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Lift the card slightly on hover. */
  hover?: boolean;
  /** Live backdrop blur. Only use over sharp artwork: it is costly to render. */
  blur?: boolean;
  className?: string;
}

export default function GlassCard({ children, hover = false, blur = false, className = "", ...rest }: GlassCardProps) {
  return (
    <motion.div
      className={`glass relative overflow-hidden ${blur ? "glass-blur" : ""} ${className}`}
      {...(hover
        ? {
            whileHover: { y: -8, boxShadow: "0 30px 60px -24px rgba(4,24,8,0.8), 0 0 50px -10px rgba(168,243,61,0.35)" },
            transition: { type: "spring", stiffness: 300, damping: 24 },
          }
        : {})}
      {...rest}
    >
      {/* top inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />
      {children}
    </motion.div>
  );
}
