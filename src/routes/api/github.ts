import { createFileRoute } from "@tanstack/react-router";

import { getGithubActivity } from "@/lib/github.server";

const FIRST_YEAR = 2025; // the GitHub account was created in 2025

export const Route = createFileRoute("/api/github")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const now = new Date().getFullYear();
        const asked = Number(new URL(request.url).searchParams.get("year"));
        const year = Number.isInteger(asked) && asked >= FIRST_YEAR && asked <= now ? asked : now;
        try {
          const activity = await getGithubActivity(year);
          return Response.json(activity, {
            headers: { "cache-control": "public, max-age=900, s-maxage=21600, stale-while-revalidate=86400" },
          });
        } catch (error) {
          console.error("[github]", error);
          return Response.json({ error: "GitHub activity is unavailable right now" }, { status: 502 });
        }
      },
    },
  },
});
