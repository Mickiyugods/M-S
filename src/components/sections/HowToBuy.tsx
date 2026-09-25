"use client";

import { motion } from "framer-motion";
import { ArrowDownUp, PartyPopper, Wallet, Coins, type LucideIcon } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { MeadowBackground } from "@/components/ui/Scene";

const steps: { title: string; description: string; Icon: LucideIcon }[] = [
  { title: "Get a Wallet", description: "Install your preferred crypto wallet.", Icon: Wallet },
  { title: "Add Funds", description: "Deposit the supported token into your wallet.", Icon: Coins },
  { title: "Swap", description: "Connect your wallet and swap for Mspike.", Icon: ArrowDownUp },
  { title: "Join", description: "Welcome to the Mspike community.", Icon: PartyPopper },
];

export default function HowToBuy() {
  return (
    <section aria-labelledby="how-title" className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <MeadowBackground position="50% 85%" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle id="how-title" eyebrow="Step by step" title="How to Buy" subtitle="Get Mspike in a few simple steps." />

        <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description, Icon }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard hover blur className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span
                    aria-label={`Step ${i + 1}`}
                    className="grid size-14 place-items-center rounded-full bg-gradient-to-b from-soft-lime to-lime font-display text-2xl font-bold text-ink shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-3px_0_rgba(72,169,43,0.5),0_0_24px_rgba(168,243,61,0.55)]"
                  >
                    {i + 1}
                  </span>
                  <Icon aria-hidden className="size-8 text-soft-lime/70" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-2 leading-relaxed text-cream/80">{description}</p>
              </GlassCard>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
