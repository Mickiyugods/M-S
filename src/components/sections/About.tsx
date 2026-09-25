"use client";

import { Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import GlassCard from "@/components/ui/GlassCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Reveal from "@/components/ui/Reveal";
import { SceneBackdrop, SceneInline, SceneSoftBackdrop } from "@/components/ui/Scene";

const sceneAlt = "Mspike waving and walking across a mossy green hill in soft sunlight";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate overflow-hidden pb-4 pt-20 sm:pt-24 lg:py-32">
      {/* Full-width meadow background; the mascot stands on the right, the text card sits on the left */}
      <SceneBackdrop
        src={siteConfig.images.aboutScene}
        alt={sceneAlt}
        side="right"
        widthClass="w-full"
        position="72% 50%"
        fullBleed
      />
      {/* Below lg the same artwork (soft focus) fills the section behind the card */}
      <SceneSoftBackdrop src={siteConfig.images.aboutScene} position="30% 50%" />

      <div className="mx-auto grid max-w-7xl items-center px-5 sm:px-8 lg:min-h-[34rem] lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <GlassCard blur className="p-7 sm:p-12">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-soft-lime">Meet the mascot</span>
            <h2 id="about-title" className="title-gradient mt-3 font-display text-4xl font-bold sm:text-5xl">
              About Mspike
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-cream/90">
              <p>
                Mspike is a cheerful meme coin project inspired by a lovable mascot and a bright green world.
              </p>
              <p>
                The goal is to create a fun community-focused brand that feels welcoming, memorable, and easy to share
                across social platforms.
              </p>
              <p>
                Mspike combines memes, creativity and community into one growing ecosystem built around positive
                energy.
              </p>
            </div>
            <PrimaryButton href="#community" icon={Users} className="mt-8">
              Join the Community
            </PrimaryButton>
          </GlassCard>
        </Reveal>

        <SceneInline
          src={siteConfig.images.aboutScene}
          alt={sceneAlt}
          className="mt-6 h-[70vw] sm:h-[48vw]"
          position="68% 50%"
        />
      </div>
    </section>
  );
}
