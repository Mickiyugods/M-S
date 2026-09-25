"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { MeadowBackground } from "@/components/ui/Scene";

const faqs = [
  {
    q: "What is Mspike?",
    a: "Mspike is a community-focused meme coin built around a cheerful mascot, creative content and positive Web3 culture.",
  },
  {
    q: "How can I buy Mspike?",
    a: "Once the token is live, users will be able to connect a supported wallet and swap for Mspike through the official purchase interface.",
  },
  {
    q: "What blockchain is Mspike on?",
    a: "Official network information will be announced through Mspike's verified channels.",
  },
  {
    q: "Is the contract address available?",
    a: "Always use the contract address displayed on the official Mspike website and verified social channels.",
  },
  {
    q: "How can I join the community?",
    a: "You can join the Mspike community on X (Twitter), our official community channel.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <MeadowBackground position="70% 70%" />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionTitle id="faq-title" eyebrow="Questions" title="FAQ" subtitle="Everything you need to know about Mspike." />

        <div className="mt-14 space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const btnId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div
                  className={`glass glass-blur transition-[border-color,box-shadow] duration-300 ${isOpen ? "!border-lime/50" : ""}`}
                >
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 rounded-[24px] p-5 text-left font-display text-lg font-semibold text-white sm:p-6 sm:text-xl"
                    >
                      {item.q}
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${
                          isOpen ? "bg-lime text-ink" : "bg-white/10 text-soft-lime"
                        }`}
                      >
                        <Plus aria-hidden className="size-5" strokeWidth={2.6} />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-6 text-lg leading-relaxed text-cream/85 sm:px-6">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
