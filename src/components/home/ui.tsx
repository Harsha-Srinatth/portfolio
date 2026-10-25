import type { CSSProperties, ReactNode, SVGProps } from "react";
import {
  Award,
  Bot,
  Brain,
  CloudSun,
  Cpu,
  Database,
  Gauge,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Leaf,
  MessageCircle,
  Radio,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Tags,
  Trophy,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Icons referenced by name from data.ts. */
const ICONS: Record<string, LucideIcon> = {
  Award,
  Bot,
  Brain,
  CloudSun,
  Cpu,
  Database,
  Gauge,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Leaf,
  MessageCircle,
  Radio,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Tags,
  Trophy,
  Users,
  Workflow,
};

export function NamedIcon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={1.6} aria-hidden />;
}

/** The site's card: ivory on limestone, a hairline border, generous rounding. */
export function Card({ children, className = "", style, as: Tag = "div" }: { children: ReactNode; className?: string; style?: CSSProperties; as?: "div" | "li" | "article" }) {
  return (
    <Tag className={`rounded-[1.4rem] border border-border bg-card ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/** A small square holding an icon, in jade. */
export function IconChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-accent ${className}`}>
      {children}
    </span>
  );
}

/** A quiet pill for tools, tags and years. */
export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[0.8rem] text-foreground/80 ${className}`}>
      {children}
    </span>
  );
}

/* Brand marks (lucide no longer ships them) */

export function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
