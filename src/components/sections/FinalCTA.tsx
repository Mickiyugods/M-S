"use client";

import Image from "next/image";
import { ShoppingBag, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Reveal from "@/components/ui/Reveal";
import { FloatingLeaves, LightParticles, SunRays } from "@/components/ui/Ambient";

export default function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden pt-16 sm:pt-24 lg:pt-36">
      {/* Meadow background with a strong sunlight glow; fades in at the top and out at the bottom so the section has no hard edges */}
      <div aria-hidden className="absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_80%,transparent)]">
        <Image src={siteConfig.images.forestBackground} alt="" fill sizes="100vw" className="object-cover object-bottom opacity-70" />
        <div className="absolute inset-0 bg-deep/45" />
        <div className="absolute left-1/2 top-[38%] size-[56rem] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-[radial-gradient(circle,rgba(255,241,210,0.75),rgba(212,255,128,0.35)_35%,transparent_68%)]" />
        <SunRays />
      </div>
      <LightParticles />
      <FloatingLeaves count={5} />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-8">
        <Reveal>
          <h2 id="cta-title" className="title-gradient font-display text-5xl font-bold sm:text-7xl">
            Join Mspike
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cream sm:text-xl">
            Be part of the journey and help grow the Mspike community.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <PrimaryButton href={siteConfig.links.buy} icon={ShoppingBag} size="lg" className="sm:min-w-52">
              Buy Now
            </PrimaryButton>
            <PrimaryButton href="#community" icon={Users} size="lg" variant="secondary">
              Join Community
            </PrimaryButton>
          </div>
        </Reveal>
      </div>

      {/* Mspike lying in the grass: the hero artwork, edge to edge, served as supplied */}
      <div className="relative mt-10 h-[70vw] w-full [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_84%,transparent)] sm:h-[56vw] lg:mt-12 lg:h-[min(56vw,760px)]">
        <Image
          src={siteConfig.images.heroBackground}
          alt="Mspike lying happily in the green grass"
          fill
          unoptimized
          className="object-cover"
          style={{ objectPosition: "65% 55%" }}
        />
      </div>
    </section>
  );
}
