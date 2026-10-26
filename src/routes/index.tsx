import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { recordVisitOnce } from "@/lib/visit";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Work } from "@/components/home/Work";
import { Path } from "@/components/home/Path";
import { Skills } from "@/components/home/Skills";
import { Recognition } from "@/components/home/Recognition";
import { BuildLog } from "@/components/home/BuildLog";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Course } from "@/components/home/Section";
import { useReveal } from "@/components/home/useReveal";
import { LIKES_EVENT } from "@/components/home/likeStore";
import { Toaster } from "@/components/home/Toast";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harsha Srinatth Ryali — Full-Stack Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Harsha Srinatth Ryali — Computer Science & Business Systems at SRKR Engineering College, Bhimavaram. Full-stack, backend and MERN engineering.",
      },
      { property: "og:title", content: "Harsha Srinatth Ryali — Full-Stack Engineer" },
      {
        property: "og:description",
        content: "Scalable MERN systems, real-time communication and data-driven products.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [hearts, setHearts] = useState<number | null>(null);
  useReveal();

  // a like sent from the hero card updates the count shown in the footer
  useEffect(() => {
    const onLikes = (e: Event) => setHearts((e as CustomEvent<number>).detail);
    window.addEventListener(LIKES_EVENT, onLikes);
    return () => window.removeEventListener(LIKES_EVENT, onLikes);
  }, []);

  // Every page open increments the global visitor count (no per-user tracking).
  // recordVisitOnce() guarantees one increment per page load, even under
  // Strict Mode or remounts.
  useEffect(() => {
    void recordVisitOnce()
      .then((stats) => {
        setVisitorCount(stats.currentCount);
        setHearts(stats.likes);
      })
      .catch((error) => {
        console.error("[stats] Failed to record visit", error);
      });
  }, []);

  return (
    <>
      <a
        href="#about"
        className="sr-only z-[70] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main className="relative w-full">
        <Hero />
        <About />
        <Course />
        <Work />
        <Course />
        <Path />
        <Course />
        <Skills />
        <Course />
        <Recognition />
        <Course />
        <BuildLog />
        <Course />
        <Contact />
      </main>
      <Footer visitorCount={visitorCount} hearts={hearts} onHeartsChange={setHearts} />
      <Toaster />
    </>
  );
}
