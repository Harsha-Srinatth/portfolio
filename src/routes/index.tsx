import { Suspense, lazy, useEffect, type ComponentType } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { recordVisitOnce } from "@/lib/visit";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { heroReady } from "@/components/home/hero/ready";
import { Course } from "@/components/home/Section";
import { useReveal } from "@/components/home/useReveal";
import { usePointerGlow } from "@/components/home/motionEvents";
import { Rail } from "@/components/home/Rail";
import { LIKES_EVENT } from "@/components/home/likeStore";
import { setStats } from "@/components/home/statsStore";
import { Toaster } from "@/components/home/Toast";

/*
 * Everything below the first screen. Its HTML arrives with the page as
 * before, but its scripts load and start up (hydrate) only once the hero has
 * finished arriving, one section at a time, so the tree's entrance has the
 * main thread to itself. Scrolling or tapping starts them at once.
 */
function later<P>(load: () => Promise<ComponentType<P>>) {
  return lazy(() => heroReady.then(load).then((c) => ({ default: c })));
}
const About = later(() => import("@/components/home/About").then((m) => m.About));
const Experience = later(() => import("@/components/home/Experience").then((m) => m.Experience));
const Work = later(() => import("@/components/home/Work").then((m) => m.Work));
const Path = later(() => import("@/components/home/Path").then((m) => m.Path));
const Skills = later(() => import("@/components/home/Skills").then((m) => m.Skills));
const Recognition = later(() => import("@/components/home/Recognition").then((m) => m.Recognition));
const BuildLog = later(() => import("@/components/home/BuildLog").then((m) => m.BuildLog));
const Contact = later(() => import("@/components/home/Contact").then((m) => m.Contact));
const Footer = later(() => import("@/components/home/Footer").then((m) => m.Footer));

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
  // No state here: this component must not re-render after it has mounted, or
  // the sections still waiting to start up lose their content (statsStore.ts).
  useReveal();
  usePointerGlow();

  // a like sent from the hero card updates the count shown in the footer
  useEffect(() => {
    const onLikes = (e: Event) => setStats({ likes: (e as CustomEvent<number>).detail });
    window.addEventListener(LIKES_EVENT, onLikes);
    return () => window.removeEventListener(LIKES_EVENT, onLikes);
  }, []);

  // Every page open increments the global visitor count (no per-user tracking).
  // recordVisitOnce() guarantees one increment per page load, even under
  // Strict Mode or remounts.
  useEffect(() => {
    void recordVisitOnce()
      .then((stats) => {
        setStats({ visitors: stats.currentCount, likes: stats.likes });
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
      <Rail />
      <main className="relative w-full">
        <Hero />
        <Suspense>
          <About />
        </Suspense>
        <Course />
        <Suspense>
          <Experience />
        </Suspense>
        <Course />
        <Suspense>
          <Work />
        </Suspense>
        <Course />
        <Suspense>
          <Path />
        </Suspense>
        <Course />
        <Suspense>
          <Skills />
        </Suspense>
        <Course />
        <Suspense>
          <Recognition />
        </Suspense>
        <Course />
        <Suspense>
          <BuildLog />
        </Suspense>
        <Course />
        <Suspense>
          <Contact />
        </Suspense>
        <Course />
      </main>
      <Suspense>
        <Footer />
      </Suspense>
      <Toaster />
    </>
  );
}
