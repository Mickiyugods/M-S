"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { SVGProps } from "react";

interface SocialCardProps {
  name: string;
  label: string;
  href: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
}

export default function SocialCard({ name, label, href, Icon }: SocialCardProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <motion.a
      href={href}
      aria-label={`${name}: ${label}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="glass glass-blur group relative flex items-center gap-4 overflow-hidden p-5 sm:flex-col sm:items-start sm:gap-6 sm:p-7"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-lime/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60"
      />
      <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-soft-lime to-lime text-ink shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_8px_24px_-8px_rgba(168,243,61,0.8)]">
        <Icon className="size-6" />
      </span>
      <span className="relative flex flex-1 flex-col">
        <span className="font-display text-xl font-semibold text-white">{name}</span>
        <span className="text-cream/80">{label}</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="relative size-6 text-soft-lime transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:absolute sm:right-6 sm:top-6"
      />
    </motion.a>
  );
}
