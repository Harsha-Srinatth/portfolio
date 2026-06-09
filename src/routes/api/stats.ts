import { createFileRoute } from "@tanstack/react-router";

import {
  getPortfolioStats,
  incrementPortfolioLikes,
  incrementPortfolioVisitors,
} from "@/lib/stats.server";

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      GET: async () => {
        const stats = await getPortfolioStats();
        return Response.json(stats, {
          headers: { "cache-control": "no-store" },
        });
      },
      POST: async ({ request }) => {
        let action: string | undefined;

        try {
          const body = (await request.json()) as { action?: string };
          action = body.action;
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (action === "visitor") {
          const stats = await incrementPortfolioVisitors();
          return Response.json(stats);
        }

        if (action === "like") {
          const stats = await incrementPortfolioLikes();
          return Response.json(stats);
        }

        return Response.json({ error: "Unknown action" }, { status: 400 });
      },
    },
  },
});
