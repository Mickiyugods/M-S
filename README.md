# Mspike

Landing page for the **$MSPIKE** meme coin. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion and Lucide React.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: override config values
npm run dev                  # http://localhost:3000
```

Production build: `npm run build && npm start`.

## What to edit

| What | Where |
| --- | --- |
| Contract address | `contractAddress` in `src/config/site.ts` (`NEXT_PUBLIC_TOKEN_ADDRESS` overrides it) |
| Social links | `src/config/site.ts` → `socials` |
| Buy / chart links | `src/config/site.ts` → `links` |
| Tokenomics (supply, allocations, colors) | `src/config/site.ts` → `tokenomics` |
| Image paths | `src/config/site.ts` → `images` |
| Wallet connection (Reown) | `src/config/site.ts` → `wallet.projectId` (or `NEXT_PUBLIC_REOWN_PROJECT_ID`). Setup lives in `src/lib/web3.tsx` (Reown AppKit + wagmi, Robinhood Chain 4663) |

## Images

All artwork lives in `public/images/mspike/`. Replace a file with your own and keep its name.
The scene images are served exactly as supplied (`unoptimized`: no resizing or re-encoding).
All images are protected from casual saving (no right-click "Save image", drag or long-press) via the `img` rule in `src/app/globals.css`.

| File | Used in |
| --- | --- |
| `hero-background.png` | Hero background (desktop keeps the image's 1672:941 ratio so it's never cropped), Buy Mspike background and the Final CTA scene |
| `about-scene.png` | About section background (from muse.png) |
| `tokenomics-background.png` | Tokenomics section background (from Tokenomics.png; desktop keeps its 1672:941 ratio) |
| `roadmap-background.png` | Shared meadow background for Roadmap, How to Buy, Community and FAQ (`MeadowBackground` in `src/components/ui/Scene.tsx`) |
| `forest-background.png` | Final CTA backdrop |
| `world-backdrop.webp` | Pre-blurred page-wide backdrop |
| `mascot.png` | Mascot head (transparent): navbar, footer, tokenomics chart, swap card. Also copied to `src/app/icon.png` as the favicon |
| `hero-banner.webp` | Social share preview image |

If a replacement hero image has a different aspect ratio, update `lg:aspect-[1672/941]` in `src/components/sections/Hero.tsx`.

## Structure

```
src/
  app/            layout.tsx, page.tsx, globals.css, icon.png
  config/site.ts  every editable value
  lib/web3.tsx    Reown AppKit + wagmi setup (Robinhood Chain), useWallet() hook
  components/
    Providers.tsx, WalletNotice.tsx
    sections/     Navbar, Hero, FeatureCards, About, Tokenomics,
                  Roadmap, HowToBuy, BuyMspike, Community, FAQ, FinalCTA, Footer
    ui/           GlassCard, PrimaryButton, SectionTitle, SocialCard,
                  Scene, HeroTitle, FeatureIcons, Reveal, Ambient, BrandIcons
```
