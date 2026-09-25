"use client";

import { motion } from "framer-motion";
import { ChartLine, Leaf, Rocket, Sprout, type LucideIcon } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { MeadowBackground } from "@/components/ui/Scene";

const phases: { phase: string; title: string; items: string[]; Icon: LucideIcon }[] = [
  {
    phase: "Phase 1",
    title: "Launch",
    items: ["Brand setup", "Website launch", "Community opening", "Social media launch"],
    Icon: Leaf,
  },
  {
    phase: "Phase 2",
    title: "Community Growth",
    items: ["Meme campaigns", "Community events", "Holder growth", "Content expansion"],
    Icon: Sprout,
  },
  {
    phase: "Phase 3",
    title: "Momentum",
    items: ["Partnerships", "Community activities", "Marketing expansion", "Increased visibility"],
    Icon: ChartLine,
  },
  {
    phase: "Phase 4",
    title: "Beyond",
    items: ["Ecosystem ideas", "Additional utilities", "Community-led initiatives", "Sustainable long-term growth"],
    Icon: Rocket,
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <MeadowBackground position="50% 60%" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle id="roadmap-title" eyebrow="The journey" title="Roadmap" subtitle="Where Mspike is growing next." />

        <div className="relative mt-16 lg:mt-20">
          {/* Glowing connector line: vertical on mobile/tablet, horizontal on desktop */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div
              className="absolute bottom-8 left-8 top-8 w-1 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-lime via-primary to-lime shadow-[0_0_18px_rgba(168,243,61,0.8)] lg:hidden"
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-1 origin-left rounded-full bg-gradient-to-r from-lime via-primary to-lime shadow-[0_0_18px_rgba(168,243,61,0.8)] lg:block"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </motion.div>

          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            {phases.map(({ phase, title, items, Icon }, i) => (
              <motion.li
                key={phase}
                className="relative flex gap-6 lg:flex-col lg:items-center lg:gap-8"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="relative z-10 grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-b from-soft-lime to-lime text-ink shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_0_0_6px_rgba(14,53,24,0.9),0_0_30px_rgba(168,243,61,0.7)] lg:size-20">
                  <Icon aria-hidden className="size-7 lg:size-8" strokeWidth={2.2} />
                </span>

                <div className="glass glass-blur flex-1 p-6 lg:w-full lg:p-7">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-soft-lime">{phase}</span>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-white">{title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-cream/85">
                        <span aria-hidden className="size-2 shrink-0 rounded-full bg-lime shadow-[0_0_8px_#A8F33D]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
