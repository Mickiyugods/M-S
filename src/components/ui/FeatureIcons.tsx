/**
 * Glossy "3D" feature icons standing on a lime pedestal, styled after the
 * Mspike mockup: extruded depth, soft shading, specular highlights and a
 * cast shadow. Static SVG; every gradient/filter id is namespaced per icon.
 */

type IconName = "leaf" | "flame" | "chart" | "people";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      {/* pedestal */}
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#D4FF80" stopOpacity=".55" />
        <stop offset="100%" stopColor="#A8F33D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2A7A1C" />
        <stop offset="45%" stopColor="#5CBB2C" />
        <stop offset="100%" stopColor="#246A18" />
      </linearGradient>
      <radialGradient id={`${id}-top`} cx="42%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#F4FFD6" />
        <stop offset="45%" stopColor="#B8F550" />
        <stop offset="100%" stopColor="#6CC22E" />
      </radialGradient>
      {/* soft blur used for shadows, glows and specular highlights */}
      <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
      <filter id={`${id}-glowblur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      {/* shared lime body shading */}
      <linearGradient id={`${id}-lime`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#F0FFC4" />
        <stop offset="35%" stopColor="#B6F24A" />
        <stop offset="100%" stopColor="#4FAE27" />
      </linearGradient>
      <linearGradient id={`${id}-limeDark`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5DB52E" />
        <stop offset="100%" stopColor="#23661A" />
      </linearGradient>
      <radialGradient id={`${id}-sphere`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FAFFE6" />
        <stop offset="40%" stopColor="#B8F24C" />
        <stop offset="100%" stopColor="#3F9A22" />
      </radialGradient>
    </defs>
  );
}

function Pedestal({ id }: { id: string }) {
  return (
    <g>
      <ellipse cx="60" cy="90" rx="58" ry="17" fill={`url(#${id}-glow)`} />
      <ellipse cx="60" cy="99" rx="40" ry="6" fill="#0E3518" opacity=".5" filter={`url(#${id}-soft)`} />
      {/* cylinder side */}
      <path d="M18 84v8c0 6.1 18.8 11 42 11s42-4.9 42-11v-8Z" fill={`url(#${id}-side)`} />
      {/* top face */}
      <ellipse cx="60" cy="84" rx="42" ry="11" fill={`url(#${id}-top)`} />
      <ellipse cx="60" cy="84" rx="42" ry="11" fill="none" stroke="#F7FFE3" strokeOpacity=".7" strokeWidth="1" />
      <ellipse cx="52" cy="81.5" rx="20" ry="3" fill="#fff" opacity=".45" filter={`url(#${id}-soft)`} />
    </g>
  );
}

function Leaf({ id }: { id: string }) {
  const body = "M88 8C58 10 34 27 34 53c0 10 4.5 18.5 11 23 23-2 44-21 46-47 .6-8.5-.9-15.6-3-21Z";
  return (
    <g>
      <ellipse cx="54" cy="84" rx="20" ry="4" fill="#23661A" opacity=".55" filter={`url(#${id}-soft)`} />
      {/* stem */}
      <path d="M46 75c-2 4-3.5 6.5-6 9" stroke="#3E9A22" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* extruded edge */}
      <path d={body} transform="translate(2.5 3)" fill={`url(#${id}-limeDark)`} />
      {/* face */}
      <path d={body} fill={`url(#${id}-lime)`} />
      {/* edge shading for volume */}
      <path d={body} fill="none" stroke="#3E9A22" strokeOpacity=".45" strokeWidth="2" />
      {/* veins */}
      <path d="M45 75C55 57 67 38 83 15" stroke="#F4FFD9" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity=".95" />
      <path d="M57 55l-11-5M65 43l-10-8M68 53l12-2M75 38l11-4M61 64l-8 1" stroke="#F4FFD9" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
      {/* specular */}
      <path d="M42 44c3-13 14-24 30-29" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".6" filter={`url(#${id}-soft)`} />
    </g>
  );
}

function Flame({ id }: { id: string }) {
  const outer = "M60 4c4 20 28 29 28 54 0 15-12.5 25-28 25S32 73 32 58c0-13 8-19.5 13-28 2 10.5 6.5 14 10.5 14-2.5-14-2.5-27 4.5-40Z";
  const middle = "M60 30c5 12 18 18 18 32 0 11-8 17.5-18 17.5S42 73 42 63c0-10 9-14.5 11-22 2.5 6 5 8 7 8-1.5-7 0-13 0-19Z";
  const core = "M60 50c4 8 10.5 11 10.5 19 0 6.5-4.8 10.5-10.5 10.5S49.5 75.5 49.5 70c0-7.5 8-10 10.5-20Z";
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-f1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD84F" />
          <stop offset="55%" stopColor="#FF8A1F" />
          <stop offset="100%" stopColor="#E4460E" />
        </linearGradient>
        <linearGradient id={`${id}-f2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE680" />
          <stop offset="100%" stopColor="#FF9E2A" />
        </linearGradient>
        <linearGradient id={`${id}-f3`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBE0" />
          <stop offset="100%" stopColor="#FFD24A" />
        </linearGradient>
      </defs>
      {/* warm glow */}
      <path d={outer} fill="#FF9A2A" opacity=".55" filter={`url(#${id}-glowblur)`} />
      <ellipse cx="60" cy="84" rx="18" ry="3.5" fill="#B5530E" opacity=".45" filter={`url(#${id}-soft)`} />
      <path d={outer} fill={`url(#${id}-f1)`} />
      <path d={middle} fill={`url(#${id}-f2)`} />
      <path d={core} fill={`url(#${id}-f3)`} />
      {/* specular */}
      <path d="M41 50c2-7 5.5-12 8.5-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".65" filter={`url(#${id}-soft)`} />
      <path d="M62 12c2 5 5 9 8 12" stroke="#FFF3B0" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".8" />
    </g>
  );
}

function Chart({ id }: { id: string }) {
  const bars: [number, number][] = [
    [30, 54],
    [51, 38],
    [72, 16],
  ];
  const w = 15;
  const base = 80;
  const dx = 6;
  const dy = -4;
  return (
    <g>
      <ellipse cx="60" cy="84" rx="30" ry="4" fill="#23661A" opacity=".55" filter={`url(#${id}-soft)`} />
      {bars.map(([x, y]) => (
        <g key={x}>
          {/* right side */}
          <path d={`M${x + w} ${y}l${dx} ${dy}V${base + dy}l${-dx} ${-dy}Z`} fill={`url(#${id}-limeDark)`} />
          {/* top */}
          <path d={`M${x} ${y}l${dx} ${dy}h${w}l${-dx} ${-dy}Z`} fill="#F4FFD6" />
          {/* front */}
          <rect x={x} y={y} width={w} height={base - y} fill={`url(#${id}-lime)`} />
          <rect x={x + 2.5} y={y + 3} width="3.5" height={base - y - 7} rx="1.75" fill="#fff" opacity=".6" />
        </g>
      ))}
    </g>
  );
}

function People({ id }: { id: string }) {
  // A rounded "bust": dome-shaped body under a glossy sphere head
  const figure = (cx: number, headY: number, r: number, shoulder: number, bottom: number, fill: string) => {
    const top = headY + r + 3;
    const k = (bottom - top) * 0.3;
    return (
      <g>
        <path
          d={`M${cx - shoulder} ${bottom}C${cx - shoulder} ${top + k} ${cx - shoulder * 0.55} ${top} ${cx} ${top}S${cx + shoulder} ${top + k} ${cx + shoulder} ${bottom}Z`}
          fill={fill}
        />
        <circle cx={cx} cy={headY} r={r} fill={`url(#${id}-sphere)`} />
      </g>
    );
  };
  return (
    <g>
      <ellipse cx="60" cy="84" rx="32" ry="4.5" fill="#23661A" opacity=".55" filter={`url(#${id}-soft)`} />
      {/* back row */}
      {figure(35, 40, 9, 14, 81, `url(#${id}-limeDark)`)}
      {figure(85, 40, 9, 14, 81, `url(#${id}-limeDark)`)}
      <ellipse cx="35" cy="62" rx="9" ry="12" fill={`url(#${id}-lime)`} opacity=".55" />
      <ellipse cx="85" cy="62" rx="9" ry="12" fill={`url(#${id}-lime)`} opacity=".55" />
      {/* front figure */}
      <ellipse cx="60" cy="82" rx="22" ry="4" fill="#23661A" opacity=".5" filter={`url(#${id}-soft)`} />
      {figure(60, 29, 12.5, 21, 82, `url(#${id}-lime)`)}
      {/* speculars */}
      <ellipse cx="55" cy="24" rx="4.5" ry="3" fill="#fff" opacity=".75" filter={`url(#${id}-soft)`} />
      <path d="M46 72c0-9 3.5-17 9-20" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".55" filter={`url(#${id}-soft)`} />
    </g>
  );
}

const glyphs = { leaf: Leaf, flame: Flame, chart: Chart, people: People } as const;

export default function FeatureIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const id = `fi-${name}`;
  const Glyph = glyphs[name];
  return (
    <svg viewBox="0 0 120 106" className={className} aria-hidden focusable="false">
      <Defs id={id} />
      <Pedestal id={id} />
      <Glyph id={id} />
    </svg>
  );
}

/* Solid button icons (mockup style), sized/colored like Lucide icons via className */

export function SolidLeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path d="M20.5 2.5C12 3 5.5 7.5 5.5 14c0 2.4 1 4.4 2.5 5.6 6.3-.4 11.6-5.4 12.3-12 .2-2 0-3.7.2-5.1Z" fill="currentColor" />
      <path d="M7.6 19.4C10 15 13 11 17.5 6.5" stroke="#D4FF80" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M8 19.6 5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SolidBarsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <rect x="3" y="13" width="4.5" height="8" rx="1.2" fill="currentColor" />
      <rect x="9.75" y="8.5" width="4.5" height="12.5" rx="1.2" fill="currentColor" />
      <rect x="16.5" y="3" width="4.5" height="18" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export type { IconName };
