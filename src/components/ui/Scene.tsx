import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Full scene artwork used as a section's environment instead of a boxed picture.
 * Files are served exactly as supplied (unoptimized: no resizing or re-encoding).
 */

interface SceneProps {
  src: string;
  alt: string;
  /** CSS object-position that keeps the mascot in frame. */
  position?: string;
}

/**
 * Desktop (lg+): the artwork fills one side of the section (the mascot's side) and
 * fades out toward the text card and into the page above and below.
 */
export function SceneBackdrop({
  src,
  alt,
  position = "center",
  side,
  widthClass,
  fullBleed = false,
}: SceneProps & {
  side: "left" | "right";
  widthClass: string;
  /** Keep the text-card side partly visible instead of fading it out completely. */
  fullBleed?: boolean;
}) {
  const innerFade = fullBleed
    ? `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 0%, #000 45%, rgba(0,0,0,0.55) 100%)`
    : `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 0%, #000 58%, transparent 100%)`;
  const edgeFade = "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)";

  return (
    <div
      className={`absolute inset-y-0 -z-10 hidden lg:block ${side === "left" ? "left-0" : "right-0"} ${widthClass}`}
      style={{
        WebkitMaskImage: `${innerFade}, ${edgeFade}`,
        WebkitMaskComposite: "source-in",
        maskImage: `${innerFade}, ${edgeFade}`,
        maskComposite: "intersect",
      }}
    >
      <Image src={src} alt={alt} fill unoptimized className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}

/**
 * Below lg: the artwork edge to edge (breaking out of the container padding),
 * with top and bottom faded into the page. Size it with a height class.
 */
export function SceneInline({ src, alt, position = "center", className = "" }: SceneProps & { className?: string }) {
  return (
    <div
      className={`relative -mx-5 sm:-mx-8 lg:hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] ${className}`}
    >
      <Image src={src} alt={alt} fill unoptimized className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}

/**
 * Below lg: fills the whole section with a soft-focus copy of the artwork (CSS blur
 * on the same file), so text cards sit on the scene instead of a flat colour.
 */
export function SceneSoftBackdrop({ src, position = "center" }: Omit<SceneProps, "alt">) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-20 overflow-hidden lg:hidden [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_88%,transparent)]"
    >
      <Image src={src} alt="" fill unoptimized className="scale-110 object-cover blur-xl" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-deep/25" />
    </div>
  );
}

/**
 * Shared meadow background (Roadmap.png) for the lower sections. lg+: the sharp
 * artwork covers the section with a light shade and soft top/bottom fades.
 * Below lg: a soft-focus copy (a tall, narrow section would zoom the sharp image).
 */
export function MeadowBackground({ position = "center" }: { position?: string }) {
  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 hidden [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_85%,transparent)] lg:block">
        <Image src={siteConfig.images.roadmapBackground} alt="" fill unoptimized className="object-cover" style={{ objectPosition: position }} />
        {/* light shade so titles and cards stay readable over the bright sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep/45 via-deep/15 to-deep/35" />
      </div>
      <SceneSoftBackdrop src={siteConfig.images.roadmapBackground} position={position} />
    </>
  );
}
