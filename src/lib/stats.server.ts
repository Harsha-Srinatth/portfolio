import fs from "node:fs/promises";
import path from "node:path";

type PortfolioStats = {
  visitors: number;
  likes: number;
};

const STATS_FILE = path.join(process.cwd(), ".data", "portfolio-stats.json");

const defaultStats = (): PortfolioStats => ({
  visitors: 0,
  likes: 0,
});

async function readStats(): Promise<PortfolioStats> {
  try {
    const raw = await fs.readFile(STATS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<PortfolioStats>;
    return {
      visitors: Number(parsed.visitors) || 0,
      likes: Number(parsed.likes) || 0,
    };
  } catch {
    return defaultStats();
  }
}

async function writeStats(stats: PortfolioStats) {
  await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
}

export async function getPortfolioStats() {
  return readStats();
}

export async function incrementPortfolioVisitors() {
  const stats = await readStats();
  stats.visitors += 1;
  await writeStats(stats);
  return stats;
}

export async function incrementPortfolioLikes() {
  const stats = await readStats();
  stats.likes += 1;
  await writeStats(stats);
  return stats;
}
