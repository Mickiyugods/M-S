import type { SVGProps } from "react";
import { siteConfig, type SocialKey } from "@/config/site";

type IconProps = SVGProps<SVGSVGElement>;

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.94 4.3 18.9 18.63c-.23 1.01-.83 1.26-1.68.79l-4.63-3.41-2.23 2.15c-.25.25-.46.46-.94.46l.33-4.72 8.6-7.77c.37-.33-.08-.52-.58-.19L7.14 12.62l-4.57-1.43c-.99-.31-1.01-.99.21-1.47L20.63 2.9c.83-.31 1.55.19 1.31 1.4Z" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.36 2.8a13.7 13.7 0 0 0-.64 1.3 18.4 18.4 0 0 0-5.45 0 12.6 12.6 0 0 0-.65-1.3 19.7 19.7 0 0 0-4.96 1.57C.53 9.1-.32 13.72.1 18.28a19.9 19.9 0 0 0 6.07 3.07 14.7 14.7 0 0 0 1.3-2.12 12.9 12.9 0 0 1-2.05-.99l.5-.39a14.2 14.2 0 0 0 12.16 0l.5.39c-.65.39-1.34.72-2.05.99.37.75.81 1.46 1.3 2.12a19.8 19.8 0 0 0 6.07-3.07c.5-5.28-.84-9.86-3.58-13.91ZM8.02 15.47c-1.18 0-2.16-1.09-2.16-2.42s.95-2.42 2.16-2.42c1.2 0 2.18 1.09 2.16 2.42 0 1.33-.96 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.16-1.09-2.16-2.42s.95-2.42 2.16-2.42c1.2 0 2.18 1.09 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const socialMeta: Record<
  SocialKey,
  { name: string; label: string; Icon: (props: IconProps) => React.JSX.Element }
> = {
  twitter: { name: "X / Twitter", label: "Follow Updates", Icon: XIcon },
  telegram: { name: "Telegram", label: "Join the Chat", Icon: TelegramIcon },
  discord: { name: "Discord", label: "Meet the Community", Icon: DiscordIcon },
  instagram: { name: "Instagram", label: "See the Visuals", Icon: InstagramIcon },
};

const allSocials: SocialKey[] = ["twitter", "telegram", "discord", "instagram"];

/** Social channels configured in siteConfig.socials, in display order. */
export const activeSocials = allSocials.flatMap((key) => {
  const href = siteConfig.socials[key];
  return href ? [{ key, href, ...socialMeta[key] }] : [];
});
