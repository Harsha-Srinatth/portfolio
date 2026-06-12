export type PortfolioStats = {
  currentCount: number;
  likes: number;
};

async function parseStatsResponse(res: Response): Promise<PortfolioStats> {
  if (!res.ok) {
    throw new Error(`Stats request failed (${res.status})`);
  }
  return (await res.json()) as PortfolioStats;
}

export async function fetchStats(): Promise<PortfolioStats> {
  const res = await fetch("/api/stats", {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  return parseStatsResponse(res);
}

export async function recordOpen(): Promise<PortfolioStats> {
  const res = await fetch("/api/stats", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ action: "open" }),
  });
  return parseStatsResponse(res);
}

export async function recordLike(): Promise<PortfolioStats> {
  const res = await fetch("/api/stats", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ action: "like" }),
  });
  return parseStatsResponse(res);
}
