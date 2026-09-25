import Reveal from "./Reveal";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  id?: string;
  /** "center-lg-left": centered on small screens, left-aligned from lg up. */
  align?: "center" | "left" | "center-lg-left";
}

export default function SectionTitle({ title, subtitle, eyebrow, id, align = "center" }: SectionTitleProps) {
  const alignment = {
    center: "text-center mx-auto items-center",
    left: "text-left items-start",
    "center-lg-left": "text-center mx-auto items-center lg:mx-0 lg:text-left lg:items-start",
  }[align];
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className="glass-soft inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-soft-lime">
          <span aria-hidden className="size-1.5 rounded-full bg-lime shadow-[0_0_10px_#A8F33D]" />
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="title-gradient font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-cream/85 sm:text-xl">{subtitle}</p>}
    </Reveal>
  );
}
