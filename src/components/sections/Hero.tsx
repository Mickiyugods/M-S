"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";
import HeroTitle from "@/components/ui/HeroTitle";
import FeatureCards from "@/components/sections/FeatureCards";
import ContractAddressPill from "@/components/ui/ContractAddress";
import { SolidBarsIcon, SolidLeafIcon } from "@/components/ui/FeatureIcons";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const heroAlt = "Mspike lying happily in a sunny meadow full of white flowers";

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-12 pt-24 sm:pt-28 lg:pb-10 lg:pt-0"
    >
      {/*
        Hero artwork (lg+): served exactly as supplied (unoptimized: no resizing or
        re-encoding), static, and always at its own 1672:941 ratio so it is never
        cropped or zoomed. The feature cards sit on the flowers along its bottom edge.
      */}
      <div className="absolute inset-x-0 top-0 -z-10 hidden aspect-[1672/941] [mask-image:linear-gradient(to_bottom,#000_88%,transparent)] lg:block">
        <Image
          src={siteConfig.images.heroBackground}
          alt={heroAlt}
          fill
          unoptimized
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
      </div>
      {/*
        Below lg (portrait screens) the artwork can't be shown whole as a background.
        Instead the whole section is filled with a soft-focus copy of it (CSS blur on
        the same file, left foliage side), and the sharp artwork sits full-bleed under
        the buttons, blending into it.
      */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_75%,transparent)] lg:hidden">
        <Image
          src={siteConfig.images.heroBackground}
          alt=""
          fill
          unoptimized
          loading="eager"
          className="scale-110 object-cover object-left-top blur-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/35 via-deep/10 to-deep/40" />
      </div>

      {/* Logotype, tagline and CTAs; on desktop in the upper left, beside the mascot */}
      <div className="lg:aspect-[1672/941]">
        <div className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col items-center px-5 sm:px-8 lg:mx-0 lg:box-content lg:w-[min(620px,38vw)] lg:max-w-none lg:px-0 lg:pl-[5vw] lg:pt-[9.5vw]">
          <motion.h1 id="hero-title" custom={0} variants={fadeUp} initial="hidden" animate="show" className="w-full">
            <span className="sr-only">{siteConfig.name}</span>
            <HeroTitle className="h-auto w-full drop-shadow-[0_18px_30px_rgba(14,53,24,0.45)]" />
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="relative -mt-[6.5%] rounded-full border border-lime/45 bg-forest/90 px-5 py-2 text-center font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_-10px_rgba(4,24,8,0.8)] sm:px-8 sm:py-2.5 sm:text-base lg:px-[2.2vw] lg:text-[min(1rem,1.1vw)]"
          >
            A meme coin for a brighter tomorrow
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-7 flex w-full gap-3 sm:mt-9 sm:gap-5 lg:gap-4"
          >
            <PrimaryButton href={siteConfig.links.buy} icon={SolidLeafIcon} size="xl" className="flex-1 lg:px-4 xl:px-8">
              Buy Now
            </PrimaryButton>
            <PrimaryButton
              href={siteConfig.links.chart}
              icon={SolidBarsIcon}
              size="xl"
              variant="secondary"
              className="flex-1 lg:px-4 xl:px-8"
            >
              Chart
            </PrimaryButton>
          </motion.div>

          {/* Contract address: under the buttons on small screens */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="mt-5 w-full lg:hidden">
            <ContractAddressPill />
          </motion.div>
        </div>
      </div>

      {/* Contract address (lg+): in the open sky above the mascot, top right */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="absolute right-[5vw] top-[11vw] z-10 hidden w-[min(36rem,44vw)] lg:block"
      >
        <ContractAddressPill />
      </motion.div>

      {/* Below lg: the sharp artwork, edge to edge, framed on the mascot and faded into the soft-focus scene */}
      <div className="relative -mt-2 h-[92vw] w-full [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_86%,transparent)] sm:mt-2 sm:h-[62vw] lg:hidden">
        <Image
          src={siteConfig.images.heroBackground}
          alt={heroAlt}
          fill
          unoptimized
          loading="eager"
          className="object-cover object-[70%_50%] sm:object-center"
        />
      </div>

      {/* Feature cards: on desktop they overlap the bottom of the artwork (the flower meadow, below the mascot) */}
      <div className="relative mt-2 lg:-mt-[8.5vw]">
        <FeatureCards />
      </div>
    </section>
  );
}
