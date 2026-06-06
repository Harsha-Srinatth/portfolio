import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/portfolio/Cursor";
import { Dock } from "@/components/portfolio/Dock";
import { Observatory } from "@/components/portfolio/Observatory";
import { Ticker } from "@/components/portfolio/Ticker";
import { About } from "@/components/portfolio/About";
import { Constellation } from "@/components/portfolio/Constellation";
import { Achievements } from "@/components/portfolio/Achievements";
import { Stratum } from "@/components/portfolio/Stratum";
import { Frequencies } from "@/components/portfolio/Frequencies";
import { Learning } from "@/components/portfolio/Learning";
import { BuildLog } from "@/components/portfolio/BuildLog";
import { Transmissions } from "@/components/portfolio/Transmissions";
import { SiteFooter } from "@/components/portfolio/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ryali Harsha Srinatth — Full-Stack Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Ryali Harsha Srinatth (Harsha) — CSBS undergraduate from Bhimavaram, AP. Full-stack, MERN, and machine learning engineering.",
      },
      { property: "og:title", content: "Ryali Harsha Srinatth — Full-Stack Engineer" },
      {
        property: "og:description",
        content: "Backend · Full-stack · AI engineering. Built by hand.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground antialiased">
      <Cursor />
      <Dock />
      <Observatory />
      <Ticker />
      <About />
      <Constellation />
      <Stratum />
      <Frequencies />
      <Achievements />
      <Learning />
      <BuildLog />
      <Transmissions />
      <SiteFooter />
    </main>
  );
}
