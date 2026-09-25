/**
 * Mspike site configuration.
 *
 * Edit this file to change token details, links, tokenomics and images
 * without touching any component code.
 */

export type SocialKey = "twitter" | "telegram" | "discord" | "instagram";

export interface TokenAllocation {
  label: string;
  percent: number;
  color: string;
}

export const siteConfig = {
  name: "Mspike",
  ticker: "$MSPIKE",
  /** Public site URL, used for social share previews. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  tagline: "A meme coin for a brighter tomorrow",
  description:
    "Mspike is a cheerful, community-focused meme coin inspired by a lovable mascot and a bright green world.",

  /**
   * Contract address, read from the NEXT_PUBLIC_TOKEN_ADDRESS env variable
   * (see .env.example). Leave it empty to show "Coming Soon".
   */
  contractAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS?.trim() ?? "",

  /**
   * Wallet connection (Reown AppKit). The project ID is a public client id
   * from https://dashboard.reown.com — it can be overridden with
   * NEXT_PUBLIC_REOWN_PROJECT_ID. Add every domain the site runs on
   * (including localhost) to the project's allowlist in the Reown dashboard.
   */
  wallet: {
    projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID?.trim() || "a682f4b23b2ce75a02d480cf97b22dae",
    /**
     * Robinhood Chain RPCs used to read balances, tried in order. The official
     * rpc.mainnet.chain.robinhood.com can't be reached from browsers, so browser-
     * friendly public endpoints go first.
     */
    rpcUrls: ["https://robinhood-rpc.publicnode.com", "https://rpc.ordofi.network", "https://rpc.mainnet.chain.robinhood.com"],
  },

  /**
   * Holder rewards paid in META (Meta Platforms stock token on Robinhood Chain).
   * Leave a value empty to show "Announced on X" in its place.
   */
  rewards: {
    token: "0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35",
    /** Minimum $MSPIKE held to qualify, e.g. 1_000_000. 0 = not announced yet. */
    minHolding: 0,
    /** How often rewards are paid, e.g. "Every week". */
    schedule: "",
  },

  /** External links. Use "#" until the real URLs are ready. */
  links: {
    buy: "#buy",
    /** Pons page for $MSPIKE (chart + trading). */
    chart: "#",
  },

  /**
   * Social links shown in the Community section and footer.
   * Only the channels listed here appear on the site. Available keys:
   * twitter, telegram, discord, instagram.
   */
  socials: {
    twitter: "https://x.com/Mspikefun",
  } as Partial<Record<SocialKey, string>>,

  tokenomics: {
    totalSupply: 1_000_000_000,
    disclaimer: "Token details shown here can be updated before launch.",
    allocations: [
      { label: "Community", percent: 65, color: "#48A92B" },
      { label: "Liquidity", percent: 30, color: "#A8F33D" },
      { label: "Development", percent: 5, color: "#F5C84B" },
    ] satisfies TokenAllocation[],
  },


  /**
   * Image paths (relative to /public). Replace the files in
   * /public/images/mspike/ with your own artwork — keep the same names.
   */
  images: {
    /** Wide banner, used for social share previews. */
    heroScene: "/images/mspike/hero-banner.webp",
    /** Hero background artwork. Served exactly as supplied (no resizing or re-encoding). */
    heroBackground: "/images/mspike/hero-background.png",
    /** Mascot head (transparent PNG): navbar, footer, tokenomics, swap card, favicon. Served as supplied. */
    avatar: "/images/mspike/mascot.png",
    /** About section background (muse.png). Served exactly as supplied. */
    aboutScene: "/images/mspike/about-scene.png",
    /** Tokenomics section background (Tokenomics.png). Served exactly as supplied. */
    tokenomicsBackground: "/images/mspike/tokenomics-background.png",
    /** Roadmap section background (Roadmap.png). Served exactly as supplied. */
    roadmapBackground: "/images/mspike/roadmap-background.png",
    forestBackground: "/images/mspike/forest-background.png",
    /** Pre-blurred page-wide backdrop (a cheap blurred copy of the forest). */
    worldBackdrop: "/images/mspike/world-backdrop.webp",
  },

  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Rewards", href: "#rewards" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Community", href: "#community" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
