/**
 * Decorative, CSS-only ambient effects (leaves, light particles, rays).
 * All positions are deterministic so server and client render identically.
 */

const LEAF_PATH = "M12 2C6 6 3 11 4 17c.4 2.4 2.2 4.4 4.6 4.9C14.5 23 20 17 20 10c0-3-1-6-2-8-1.5 2-3.5 2.4-6 0Z";

function Leaf({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8F33D" />
          <stop offset="100%" stopColor="#2F7F1F" />
        </linearGradient>
      </defs>
      <path d={LEAF_PATH} fill="url(#leafGrad)" />
      <path d="M8 20C11 14 14 9 17 4" stroke="#D4FF80" strokeOpacity=".55" strokeWidth="1" fill="none" />
    </svg>
  );
}

const leaves = [
  { left: "8%", size: 26, delay: "0s", duration: "19s" },
  { left: "22%", size: 18, delay: "-6s", duration: "23s" },
  { left: "41%", size: 22, delay: "-11s", duration: "21s" },
  { left: "58%", size: 16, delay: "-3s", duration: "25s" },
  { left: "74%", size: 28, delay: "-14s", duration: "20s" },
  { left: "88%", size: 20, delay: "-8s", duration: "24s" },
  { left: "96%", size: 14, delay: "-17s", duration: "27s" },
];

/** Hidden below md: purely decorative and the costliest effect on phones. */
export function FloatingLeaves({ count = 5 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      {leaves.slice(0, count).map((l, i) => (
        <span
          key={i}
          className="absolute -top-10 block animate-drift will-change-transform"
          style={{ left: l.left, animationDelay: l.delay, animationDuration: l.duration }}
        >
          <Leaf style={{ width: l.size, height: l.size }} />
        </span>
      ))}
    </div>
  );
}

const particles = [
  [12, 30, 0],
  [26, 62, 1.2],
  [35, 18, 2.4],
  [48, 44, 0.6],
  [55, 72, 3.1],
  [63, 26, 1.8],
  [71, 55, 2.9],
  [82, 38, 0.3],
  [90, 68, 2.2],
  [18, 80, 3.6],
  [44, 88, 1.4],
  [77, 12, 2.7],
];

/** Hidden below md, like FloatingLeaves. */
export function LightParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      {particles.map(([x, y, d], i) => (
        <span
          key={i}
          className="absolute block size-1.5 animate-twinkle rounded-full bg-cream shadow-[0_0_12px_4px_rgba(255,241,210,0.6)]"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }}
        />
      ))}
    </div>
  );
}

export function SunRays({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-1/3 left-1/2 h-[140%] w-[140%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,rgba(255,241,210,0.16)_12deg,transparent_24deg,rgba(212,255,128,0.12)_40deg,transparent_56deg,rgba(255,241,210,0.14)_72deg,transparent_90deg,transparent_270deg,rgba(212,255,128,0.1)_300deg,transparent_320deg)]" />
    </div>
  );
}
