"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import FeatureIcon, { type IconName } from "@/components/ui/FeatureIcons";

const features: { title: string; description: string; icon: IconName }[] = [
  { title: "Community Driven", description: "Built by the community, for the community.", icon: "leaf" },
  { title: "Fair Launch", description: "Equal opportunities for everyone.", icon: "flame" },
  { title: "Grow Together", description: "Let's build something bigger, together.", icon: "chart" },
  { title: "Fun & Memes", description: "Good vibes, real community, endless possibilities.", icon: "people" },
];

export default function FeatureCards() {
  return (
    <div id="features" className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8">
      <h2 className="sr-only">Why people love Mspike</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {features.map(({ title, description, icon }, i) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard hover blur className="group flex h-full flex-col items-center px-6 pb-7 pt-5 text-center lg:px-5 lg:pb-5 lg:pt-3">
              <FeatureIcon
                name={icon}
                className="h-20 w-24 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 sm:h-24 sm:w-28 lg:h-[4.5rem] lg:w-[5.25rem]"
              />
              <h3 className="mt-3 font-display text-xl font-semibold text-white sm:text-2xl lg:mt-1 lg:text-xl">{title}</h3>
              <p className="mt-2 max-w-[16rem] leading-snug text-cream/85 lg:mt-1 lg:text-sm">{description}</p>
            </GlassCard>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
