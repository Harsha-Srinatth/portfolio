import type { ReactNode } from "react";

/**
 * A laptop whose screen sketches each project's interface — drawn in the
 * site's palette (ivory, limestone, jade, brass) rather than as screenshots,
 * so every preview sits in the same world as the rest of the page.
 */

const S = { x: 56, y: 30, w: 368, h: 216 }; // the screen, in the 480 × 300 viewBox

type Kind = "dashboard" | "notes" | "wizard" | "agri";
const PROJECT_ART: Record<string, Kind> = {
  college360: "dashboard",
  "notes-bookmarks": "notes",
  habitiq: "wizard",
  agrisense: "agri",
};

const line = (x: number, y: number, w: number, o = 1) => <rect x={x} y={y} width={w} height="5" rx="2.5" fill="var(--muted-foreground)" opacity={0.35 * o} />;
const block = (x: number, y: number, w: number, h: number, fill = "var(--secondary)", r = 6) => <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />;

function Dashboard() {
  const bars = [38, 56, 44, 70, 52, 84, 62, 76];
  return (
    <>
      {block(S.x, S.y, 62, S.h, "var(--secondary)", 0)}
      <circle cx={S.x + 18} cy={S.y + 18} r="7" fill="var(--accent)" />
      {[52, 72, 92, 112, 132].map((y, i) => (
        <rect key={y} x={S.x + 12} y={S.y + y} width={i === 0 ? 38 : 30} height="6" rx="3" fill={i === 0 ? "var(--accent)" : "var(--muted-foreground)"} opacity={i === 0 ? 0.9 : 0.3} />
      ))}
      {line(S.x + 78, S.y + 16, 90)}
      <circle cx={S.x + S.w - 18} cy={S.y + 18} r="8" fill="var(--brass)" opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {block(S.x + 78 + i * 94, S.y + 36, 84, 46, "var(--card)")}
          <rect x={S.x + 78 + i * 94} y={S.y + 36} width="84" height="46" rx="6" fill="none" stroke="var(--border)" />
          {line(S.x + 88 + i * 94, S.y + 48, 34, 0.8)}
          <rect x={S.x + 88 + i * 94} y={S.y + 60} width={[46, 38, 52][i]} height="10" rx="3" fill={["var(--accent)", "var(--brass)", "var(--foreground)"][i]} opacity="0.75" />
        </g>
      ))}
      {block(S.x + 78, S.y + 92, 184, 110, "var(--card)")}
      <rect x={S.x + 78} y={S.y + 92} width="184" height="110" rx="6" fill="none" stroke="var(--border)" />
      {bars.map((h, i) => (
        <rect key={i} x={S.x + 92 + i * 20} y={S.y + 190 - h} width="11" height={h} rx="3" fill="var(--accent)" opacity={0.45 + i * 0.07} />
      ))}
      {block(S.x + 272, S.y + 92, 82, 110, "var(--card)")}
      <rect x={S.x + 272} y={S.y + 92} width="82" height="110" rx="6" fill="none" stroke="var(--border)" />
      {[106, 128, 150, 172].map((y) => (
        <g key={y}>
          <circle cx={S.x + 286} cy={S.y + y} r="6" fill="var(--secondary)" />
          {line(S.x + 297, S.y + y - 3, 44, 0.7)}
        </g>
      ))}
    </>
  );
}

function Notes() {
  const tags = ["var(--accent)", "var(--brass)", "var(--foreground)"];
  return (
    <>
      {block(S.x + 16, S.y + 14, 230, 20, "var(--secondary)", 10)}
      <circle cx={S.x + 30} cy={S.y + 24} r="5" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" opacity="0.6" />
      {block(S.x + S.w - 86, S.y + 14, 70, 20, "var(--foreground)", 10)}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = S.x + 16 + (i % 3) * 116;
        const y = S.y + 46 + Math.floor(i / 3) * 84;
        return (
          <g key={i}>
            {block(x, y, 106, 74, "var(--card)")}
            <rect x={x} y={y} width="106" height="74" rx="6" fill="none" stroke="var(--border)" />
            {line(x + 10, y + 12, 62)}
            {line(x + 10, y + 24, 80, 0.6)}
            {line(x + 10, y + 34, 70, 0.6)}
            <rect x={x + 10} y={y + 52} width="28" height="11" rx="5.5" fill={tags[i % 3]} opacity="0.7" />
            <rect x={x + 42} y={y + 52} width="22" height="11" rx="5.5" fill={tags[(i + 1) % 3]} opacity="0.35" />
          </g>
        );
      })}
    </>
  );
}

function Wizard() {
  return (
    <>
      {line(S.x + 20, S.y + 16, 120)}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={S.x + 28 + i * 40} cy={S.y + 44} r="8" fill={i < 3 ? "var(--accent)" : "var(--secondary)"} />
          {i < 5 && <rect x={S.x + 36 + i * 40} y={S.y + 43} width="24" height="2" fill={i < 2 ? "var(--accent)" : "var(--border)"} />}
        </g>
      ))}
      {block(S.x + 20, S.y + 66, 214, 136, "var(--card)")}
      <rect x={S.x + 20} y={S.y + 66} width="214" height="136" rx="6" fill="none" stroke="var(--border)" />
      {[84, 124].map((y) => (
        <g key={y}>
          {line(S.x + 34, S.y + y, 90, 0.8)}
          {block(S.x + 34, S.y + y + 10, 186, 20, "var(--secondary)", 5)}
        </g>
      ))}
      {block(S.x + 150, S.y + 170, 70, 20, "var(--accent)", 10)}
      {/* the prediction */}
      {block(S.x + 246, S.y + 66, 104, 136, "var(--card)")}
      <rect x={S.x + 246} y={S.y + 66} width="104" height="136" rx="6" fill="none" stroke="var(--border)" />
      <path d={`M${S.x + 266} ${S.y + 140} A32 32 0 0 1 ${S.x + 330} ${S.y + 140}`} fill="none" stroke="var(--secondary)" strokeWidth="10" strokeLinecap="round" />
      <path d={`M${S.x + 266} ${S.y + 140} A32 32 0 0 1 ${S.x + 318} ${S.y + 116}`} fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" />
      {line(S.x + 270, S.y + 160, 56)}
      {line(S.x + 264, S.y + 174, 68, 0.6)}
    </>
  );
}

function Agri() {
  return (
    <>
      {line(S.x + 20, S.y + 16, 110)}
      {["EN", "HI", "TE", "TA"].map((l, i) => (
        <g key={l}>
          <rect x={S.x + S.w - 150 + i * 34} y={S.y + 10} width="28" height="16" rx="8" fill={i === 2 ? "var(--accent)" : "var(--secondary)"} />
          <text x={S.x + S.w - 136 + i * 34} y={S.y + 21.5} textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fill={i === 2 ? "var(--accent-foreground)" : "var(--muted-foreground)"}>
            {l}
          </text>
        </g>
      ))}
      {block(S.x + 20, S.y + 40, 150, 162, "var(--card)")}
      <rect x={S.x + 20} y={S.y + 40} width="150" height="162" rx="6" fill="none" stroke="var(--border)" />
      {/* a leaf, being diagnosed */}
      <g transform={`translate(${S.x + 95} ${S.y + 100}) rotate(-35)`}>
        <path d="M0 -42 C28 -26 28 26 0 42 C-28 26 -28 -26 0 -42 Z" fill="var(--leaf-4)" />
        <path d="M0 -40 V40" stroke="var(--leaf-2)" strokeWidth="1.6" />
        <circle cx="9" cy="-6" r="4" fill="var(--brass)" opacity="0.8" />
        <circle cx="-8" cy="12" r="3" fill="var(--brass)" opacity="0.7" />
      </g>
      <rect x={S.x + 46} y={S.y + 160} width="98" height="9" rx="4.5" fill="var(--accent)" opacity="0.75" />
      {line(S.x + 56, S.y + 178, 78, 0.7)}
      {block(S.x + 182, S.y + 40, 168, 64, "var(--card)")}
      <rect x={S.x + 182} y={S.y + 40} width="168" height="64" rx="6" fill="none" stroke="var(--border)" />
      <circle cx={S.x + 210} cy={S.y + 72} r="13" fill="var(--brass)" opacity="0.75" />
      {line(S.x + 234, S.y + 62, 70)}
      {line(S.x + 234, S.y + 76, 92, 0.6)}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {block(S.x + 182, S.y + 114 + i * 30, 168, 24, "var(--secondary)", 5)}
          <circle cx={S.x + 196} cy={S.y + 126 + i * 30} r="5" fill="var(--accent)" opacity={0.85 - i * 0.2} />
          {line(S.x + 208, S.y + 123 + i * 30, 100 - i * 14, 0.8)}
        </g>
      ))}
    </>
  );
}

const SCREENS: Record<Kind, () => ReactNode> = { dashboard: Dashboard, notes: Notes, wizard: Wizard, agri: Agri };

export function ProjectArt({ id, className = "" }: { id: string; className?: string }) {
  const Screen = SCREENS[PROJECT_ART[id] ?? "dashboard"];
  const clip = `screen-${id}`;
  return (
    <svg viewBox="0 0 480 300" className={`block h-auto w-full ${className}`} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <rect x={S.x} y={S.y} width={S.w} height={S.h} rx="4" />
        </clipPath>
        <linearGradient id={`${clip}-glare`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* soft shadow on the desk, thrown left, as in the hero */}
      <ellipse cx="226" cy="284" rx="210" ry="9" fill="var(--scene-shadow)" opacity="0.4" />
      {/* lid and bezel */}
      <rect x={S.x - 12} y={S.y - 12} width={S.w + 24} height={S.h + 22} rx="14" fill="var(--art-ink)" />
      <circle cx="240" cy={S.y - 5} r="1.8" fill="var(--art-ink-2)" />
      <g clipPath={`url(#${clip})`}>
        <rect x={S.x} y={S.y} width={S.w} height={S.h} fill="var(--background)" />
        <Screen />
        <rect x={S.x} y={S.y} width={S.w} height={S.h} fill={`url(#${clip}-glare)`} />
      </g>
      {/* base */}
      <path d={`M${S.x - 40} 258 H${S.x + S.w + 40} L${S.x + S.w + 26} 276 Q240 282 ${S.x - 26} 276 Z`} fill="var(--art-metal)" />
      <path d={`M${S.x - 40} 258 H${S.x + S.w + 40}`} stroke="var(--art-cream)" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x="208" y="258" width="64" height="5" rx="2.5" fill="var(--art-ink-2)" opacity="0.35" />
    </svg>
  );
}
