"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { siteConfig } from "@/config/site";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { SceneSoftBackdrop } from "@/components/ui/Scene";

const R = 80;
const STROKE = 30;
const C = 2 * Math.PI * R;
const GAP = 3;

export default function Tokenomics() {
  const { allocations, totalSupply, disclaimer } = siteConfig.tokenomics;
  const total = allocations.reduce((s, a) => s + a.percent, 0) || 1;

  const segments = allocations.map((a, i) => {
    const len = (a.percent / total) * C;
    const offset = allocations.slice(0, i).reduce((s, p) => s + (p.percent / total) * C, 0);
    return { ...a, len: Math.max(len - GAP, 0.5), offset, index: i };
  });

  return (
    <section id="tokenomics" aria-labelledby="tokenomics-title" className="relative isolate overflow-hidden pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-0">
      {/*
        Tokenomics artwork (lg+): served exactly as supplied, static, at its own
        1672:941 ratio so it is never cropped. The title sits in the canopy at the
        top; the chart and allocation card sit on the flower bushes below the mascot.
      */}
      <div className="absolute inset-x-0 top-0 -z-10 hidden aspect-[1672/941] [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_78%,transparent)] lg:block">
        <Image
          src={siteConfig.images.tokenomicsBackground}
          alt="Mspike cheering with both arms up in a sunny meadow of white flowers"
          fill
          unoptimized
          className="object-cover"
        />
        {/* soft shade in the top-left canopy, where the title sits */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_38%_42%_at_12%_14%,rgba(14,53,24,0.7),transparent_100%)]" />
      </div>
      {/* Below lg the same artwork (soft focus) fills the section behind the content */}
      <SceneSoftBackdrop src={siteConfig.images.tokenomicsBackground} position="0% 100%" />

      {/* On desktop this block spans the artwork's height, with the title in the top-left canopy (clear of the mascot) */}
      <div className="px-5 sm:px-8 lg:aspect-[1672/941] lg:px-0 lg:pl-[4vw] lg:pt-[3vw]">
        <div className="lg:w-[28vw]">
          <SectionTitle
            align="center-lg-left"
            id="tokenomics-title"
            eyebrow="Supply & allocation"
            title="Tokenomics"
            subtitle="A simple, community-first distribution."
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Below lg: the sharp artwork, edge to edge, under the title */}
        <div className="relative -mx-5 mt-6 aspect-[1672/941] sm:-mx-8 lg:hidden [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_80%,transparent)]">
          <Image
            src={siteConfig.images.tokenomicsBackground}
            alt="Mspike cheering with both arms up in a sunny meadow of white flowers"
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="relative -mt-10 grid items-center gap-12 sm:-mt-16 lg:-mt-[14vw] lg:grid-cols-2 lg:gap-16">
          {/* Donut chart */}
          <Reveal className="relative mx-auto aspect-square w-full max-w-md">
            <svg viewBox="0 0 200 200" className="size-full -rotate-90 drop-shadow-[0_20px_40px_rgba(4,24,8,0.6)]" role="img" aria-labelledby="donut-desc">
              <title id="donut-desc">
                {`Token allocation: ${allocations.map((a) => `${a.label} ${a.percent}%`).join(", ")}`}
              </title>
              <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE} />
              {segments.map((s) => (
                <motion.circle
                  key={s.label}
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDashoffset={-s.offset}
                  initial={{ strokeDasharray: `0 ${C}` }}
                  whileInView={{ strokeDasharray: `${s.len} ${C}` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.2 + s.index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </svg>
            {/* Center avatar & supply */}
            <div className="absolute inset-[26%] flex flex-col items-center justify-center rounded-full bg-deep/80 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.12),0_0_40px_rgba(168,243,61,0.25)] ring-1 ring-white/15 backdrop-blur">
              <span className="relative mb-1 size-14 sm:size-20">
                <Image src={siteConfig.images.avatar} alt="" fill unoptimized className="object-contain drop-shadow-[0_2px_4px_rgba(4,24,8,0.45)]" />
              </span>
              <span className="font-display text-lg font-bold text-white sm:text-2xl">
                {new Intl.NumberFormat("en-US", { notation: "compact" }).format(totalSupply)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-soft-lime sm:text-xs">Total supply</span>
            </div>
          </Reveal>

          {/* Allocation list */}
          <Reveal delay={0.15}>
            <GlassCard blur className="p-6 sm:p-10">
              <dl className="flex flex-col items-start gap-1">
                <dt className="text-sm font-bold uppercase tracking-[0.2em] text-soft-lime">Total Supply</dt>
                <dd className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {totalSupply.toLocaleString("en-US")} {siteConfig.ticker}
                </dd>
              </dl>

              <ul className="mt-8 space-y-4">
                {allocations.map((a) => (
                  <li key={a.label}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3 text-lg font-semibold text-cream">
                        <span aria-hidden className="size-4 rounded-md ring-1 ring-white/30" style={{ background: a.color }} />
                        {a.label}
                      </span>
                      <span className="font-display text-xl font-bold text-white">{a.percent}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: a.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(a.percent / total) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-8 flex items-start gap-2 text-sm text-cream/70">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                {disclaimer}
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
