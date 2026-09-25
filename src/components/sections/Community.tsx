"use client";

import { activeSocials } from "@/components/ui/BrandIcons";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import SocialCard from "@/components/ui/SocialCard";
import { MeadowBackground } from "@/components/ui/Scene";

export default function Community() {
  return (
    <section id="community" aria-labelledby="community-title" className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <MeadowBackground position="30% 40%" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          id="community-title"
          eyebrow="Join us"
          title="Community"
          subtitle="Join the Mspike community and be part of something special."
        />

        {/* Grid width follows the number of configured channels so a single card stays centred */}
        <ul
          className={`mx-auto mt-14 grid gap-5 ${
            activeSocials.length === 1
              ? "max-w-md"
              : activeSocials.length === 2
                ? "max-w-3xl sm:grid-cols-2"
                : activeSocials.length === 3
                  ? "max-w-5xl sm:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {activeSocials.map(({ key, name, label, Icon, href }, i) => (
            <li key={key}>
              <Reveal delay={i * 0.08} className="h-full">
                <SocialCard name={name} label={label} href={href} Icon={Icon} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
