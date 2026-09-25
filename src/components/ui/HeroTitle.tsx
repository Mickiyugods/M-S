/**
 * "Mspike" logotype: puffy 3D cream letters on a mossy plate wrapped in a
 * leafy wreath with white flowers. Pure SVG, rendered once (no animation cost).
 * The viewBox leaves a margin around the wreath so no leaf is ever clipped.
 */

// Canvas (includes a margin so leaves pointing outward stay inside)
const VB = { x: 54, y: -14, w: 492, h: 284 };

// Mossy plate geometry
const PLATE = { x: 112, y: 52, w: 376, h: 158, r: 62 };
const plateRect = { x: PLATE.x, y: PLATE.y, width: PLATE.w, height: PLATE.h, rx: PLATE.r };

/** Deterministic pseudo-random in [0, 1) so server and client render identically. */
function rand(i: number) {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Evenly spaced points along the plate outline, each with its outward angle (degrees). */
function rimPoints(n: number, phase = 0) {
  const { x, y, w, h, r } = PLATE;
  const sh = w - 2 * r;
  const sv = h - 2 * r;
  const arc = (Math.PI * r) / 2;
  const segs: { len: number; at: (t: number) => [number, number] }[] = [
    { len: sh, at: (t) => [x + r + t * sh, y] },
    { len: arc, at: (t) => polar(x + w - r, y + r, r, -90 + t * 90) },
    { len: sv, at: (t) => [x + w, y + r + t * sv] },
    { len: arc, at: (t) => polar(x + w - r, y + h - r, r, t * 90) },
    { len: sh, at: (t) => [x + w - r - t * sh, y + h] },
    { len: arc, at: (t) => polar(x + r, y + h - r, r, 90 + t * 90) },
    { len: sv, at: (t) => [x, y + h - r - t * sv] },
    { len: arc, at: (t) => polar(x + r, y + r, r, 180 + t * 90) },
  ];
  const total = segs.reduce((s, g) => s + g.len, 0);
  const pts: { px: number; py: number; angle: number }[] = [];
  for (let i = 0; i < n; i++) {
    let d = ((i + phase) * total) / n;
    for (const g of segs) {
      if (d <= g.len) {
        const [px, py] = g.at(d / g.len);
        // outward normal: from the nearest point of the inner (non-rounded) rectangle
        const cx = Math.min(Math.max(px, x + r), x + w - r);
        const cy = Math.min(Math.max(py, y + r), y + h - r);
        const angle = (Math.atan2(py - cy, px - cx) * 180) / Math.PI;
        pts.push({ px, py, angle });
        break;
      }
      d -= g.len;
    }
  }
  return pts;
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

// Leaf drawn pointing up in a 24×24 box: base at (12, 24), tip at (12, 0)
const LEAF = "M12 0C19.5 6 21 14 12 24 3 14 4.5 6 12 0Z";
const LEAF_VEIN = "M12 23.5V3.5";

interface PlacedLeaf {
  transform: string;
  gradient: "back" | "front";
}

function placeLeaves(n: number, phase: number, layer: "back" | "front", seed: number): PlacedLeaf[] {
  return rimPoints(n, phase).map(({ px, py, angle }, i) => {
    const jitter = (rand(seed + i) - 0.5) * (layer === "back" ? 36 : 50);
    const scale = layer === "back" ? 1.45 + rand(seed + i + 50) * 0.5 : 1 + rand(seed + i + 90) * 0.45;
    const rot = angle + 90 + jitter;
    // sink the leaf base a little into the moss so it looks rooted
    const sink = layer === "back" ? 7 : 5;
    return {
      transform: `translate(${round(px)} ${round(py)}) rotate(${round(rot)}) translate(${round(-12 * scale)} ${round(-24 * scale + sink)}) scale(${round(scale * 100) / 100})`,
      gradient: layer,
    };
  });
}

const backLeaves = placeLeaves(40, 0, "back", 1);
const frontLeaves = placeLeaves(34, 0.5, "front", 200);

// Flowers mostly along the top edge and on the corners, like the mockup
// Positions laid out for a 532-wide plate, squeezed to the current plate width
const flowers: [number, number, number][] = (
  [
  [58, 58, 1.25], [118, 40, 0.95], [190, 48, 1.15], [262, 36, 1.3], [336, 46, 1], [408, 36, 1.2], [478, 46, 0.95],
  [544, 60, 1.3], [30, 128, 1.1], [572, 132, 1.05], [52, 204, 1.25], [548, 202, 1.2], [150, 216, 0.95],
  [300, 222, 1.1], [446, 216, 1],
  ] as [number, number, number][]
).map(([x, y, s]) => [round(300 + ((x - 300) * PLATE.w) / 532), y, s]);

export default function HeroTitle({ className = "" }: { className?: string }) {
  const text = { x: 300, y: 178, fontSize: 128, textLength: 330 };
  const textProps = {
    x: text.x,
    textAnchor: "middle" as const,
    fontSize: text.fontSize,
    fontWeight: 700,
    textLength: text.textLength,
    lengthAdjust: "spacingAndGlyphs" as const,
    strokeLinejoin: "round" as const,
    style: { fontFamily: "var(--font-fredoka), ui-rounded, sans-serif" },
  };

  return (
    <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="ht-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7420" />
          <stop offset="100%" stopColor="#174A14" />
        </linearGradient>
        <linearGradient id="ht-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFEF8" />
          <stop offset="45%" stopColor="#FFF1D2" />
          <stop offset="100%" stopColor="#F1D3A2" />
        </linearGradient>
        <linearGradient id="ht-leaf-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FAA2A" />
          <stop offset="100%" stopColor="#1F6418" />
        </linearGradient>
        <linearGradient id="ht-leaf-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9F77A" />
          <stop offset="50%" stopColor="#7CCB38" />
          <stop offset="100%" stopColor="#3E9A22" />
        </linearGradient>
        <symbol id="ht-flower" viewBox="0 0 24 24">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="12" cy="6.2" rx="4.1" ry="5.6" fill="#FFFDF5" stroke="#E9E4CC" strokeWidth=".5" transform={`rotate(${r} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="3.3" fill="#F5C84B" />
          <circle cx="11.1" cy="11.1" r="1.2" fill="#FFE9A0" />
        </symbol>
        <filter id="ht-shadow" x="-10%" y="-10%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="300" cy={PLATE.y + PLATE.h + 18} rx={PLATE.w / 2 + 10} ry="16" fill="#0E3518" opacity=".45" filter="url(#ht-shadow)" />

      {/* back leaves: darker, larger, radiating outward */}
      {backLeaves.map((l, i) => (
        <g key={`b${i}`} transform={l.transform}>
          <path d={LEAF} fill="url(#ht-leaf-back)" />
          <path d={LEAF_VEIN} stroke="#8BD54F" strokeOpacity=".5" strokeWidth="1" />
        </g>
      ))}

      {/* moss rim that the leaves grow from */}
      <rect {...plateRect} fill="none" stroke="#3C8723" strokeWidth="22" />
      <rect {...plateRect} fill="none" stroke="#5DB133" strokeWidth="10" strokeOpacity=".55" strokeDasharray="3 7" strokeLinecap="round" />

      {/* front leaves: lighter, smaller, in between */}
      {frontLeaves.map((l, i) => (
        <g key={`f${i}`} transform={l.transform}>
          <path d={LEAF} fill="url(#ht-leaf-front)" />
          <path d={LEAF_VEIN} stroke="#E6FFB8" strokeOpacity=".7" strokeWidth="1" />
        </g>
      ))}

      {/* plate */}
      <rect {...plateRect} fill="url(#ht-plate)" />
      <rect
        x={PLATE.x + 6}
        y={PLATE.y + 6}
        width={PLATE.w - 12}
        height={PLATE.h - 12}
        rx={PLATE.r - 6}
        fill="none"
        stroke="#6CC03A"
        strokeOpacity=".35"
        strokeWidth="2"
      />

      {/* 3D letters: outline shadow → extrusion → outline → face */}
      <text {...textProps} y={text.y + 10} fill="#0F3A12" stroke="#0F3A12" strokeWidth="18">
        Mspike
      </text>
      <text {...textProps} y={text.y} fill="#123F13" stroke="#123F13" strokeWidth="16">
        Mspike
      </text>
      <text {...textProps} y={text.y + 8} fill="#B7824B" stroke="#B7824B" strokeWidth="5">
        Mspike
      </text>
      <text {...textProps} y={text.y + 4} fill="#D8A86C" stroke="#D8A86C" strokeWidth="5">
        Mspike
      </text>
      <text {...textProps} y={text.y} fill="url(#ht-face)" stroke="url(#ht-face)" strokeWidth="4">
        Mspike
      </text>

      {/* flowers in front */}
      {flowers.map(([x, y, sc], i) => (
        <use key={`fl${i}`} href="#ht-flower" width={26 * sc} height={26 * sc} x={x - 13 * sc} y={y - 13 * sc} />
      ))}
    </svg>
  );
}
