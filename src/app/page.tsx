import Image from "next/image";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Tokenomics from "@/components/sections/Tokenomics";
import Rewards from "@/components/sections/Rewards";
import Roadmap from "@/components/sections/Roadmap";
import HowToBuy from "@/components/sections/HowToBuy";
import BuyMspike from "@/components/sections/BuyMspike";
import Community from "@/components/sections/Community";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import WalletNotice from "@/components/WalletNotice";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>

      {/* Shared "Mspike world" backdrop: one blurred forest behind every section */}
      <div aria-hidden className="fixed inset-0 -z-50">
        <Image src={siteConfig.images.worldBackdrop} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/85 via-forest/80 to-deep/90" />
      </div>

      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Tokenomics />
        <Rewards />
        <Roadmap />
        <HowToBuy />
        <BuyMspike />
        <Community />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WalletNotice />
    </>
  );
}
