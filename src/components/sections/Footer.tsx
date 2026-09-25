import Image from "next/image";
import { siteConfig } from "@/config/site";
import { activeSocials } from "@/components/ui/BrandIcons";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3 md:items-start">
        <div>
          <a href="#home" className="inline-flex items-center gap-3 rounded-full" aria-label={`${siteConfig.name} home`}>
            <span className="relative size-12">
              <Image src={siteConfig.images.avatar} alt="" fill unoptimized className="object-contain drop-shadow-[0_2px_4px_rgba(4,24,8,0.45)]" />
            </span>
            <span className="font-display text-2xl font-bold text-cream">{siteConfig.name}</span>
          </a>
          <p className="mt-4 max-w-xs text-cream/70">A meme coin for a brighter tomorrow.</p>
        </div>

        <nav aria-label="Footer" className="md:justify-self-center">
          <h2 className="font-display text-lg font-semibold text-white">Quick Links</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 md:grid-cols-1">
            {siteConfig.navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-md text-cream/75 transition-colors hover:text-soft-lime">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:justify-self-end">
          <h2 className="font-display text-lg font-semibold text-white">Follow Mspike</h2>
          <ul className="mt-4 flex gap-3">
            {activeSocials.map(({ key, name, Icon, href }) => {
              const external = /^https?:\/\//.test(href);
              return (
                <li key={key}>
                  <a
                    href={href}
                    aria-label={name}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/5 text-cream transition-all duration-300 hover:-translate-y-1 hover:border-lime/60 hover:bg-lime hover:text-ink hover:shadow-[0_0_24px_rgba(168,243,61,0.6)]"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-cream/55 sm:px-8 md:flex-row md:justify-between">
          <p>© 2026 Mspike. All rights reserved.</p>
          <p>Mspike is a community-driven meme project. Nothing on this website constitutes financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
