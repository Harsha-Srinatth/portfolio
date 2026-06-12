import fs from "node:fs/promises";
import path from "node:path";

import { Redis } from "@upstash/redis";

export type PortfolioStats = {
  currentCount: number;
  likes: number;
};

// v2 keys — fresh counters (old `visitors` / `likes` keys are no longer used)
const CURRENT_COUNT_KEY = "rhs:current-count";
const LIKES_KEY = "rhs:likes";
const STATS_FILE = path.join(process.cwd(), ".data", "portfolio-stats.json");

const defaultStats = (): PortfolioStats => ({
  currentCount: 0,
  likes: 0,
});

function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    process.env.STORAGE_UPSTASH_REDIS_REST_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.STORAGE_UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return new Redis({ url, token });
}

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

async function readStatsFromRedis(redis: Redis): Promise<PortfolioStats> {
  const [currentCount, likes] = await redis.mget<number>(CURRENT_COUNT_KEY, LIKES_KEY);
  return {
    currentCount: Number(currentCount) || 0,
    likes: Number(likes) || 0,
  };
}

async function readStatsFromFile(): Promise<PortfolioStats> {
  try {
    const raw = await fs.readFile(STATS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<PortfolioStats>;
    return {
      currentCount: Number(parsed.currentCount) || 0,
      likes: Number(parsed.likes) || 0,
    };
  } catch {
    return defaultStats();
  }
}

async function writeStatsToFile(stats: PortfolioStats) {
  await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
}

export async function getPortfolioStats(): Promise<PortfolioStats> {
  const redis = getRedis();
  if (redis) return readStatsFromRedis(redis);
  return readStatsFromFile();
}

export async function incrementCurrentCount(): Promise<PortfolioStats> {
  const redis = getRedis();
  if (redis) {
    const currentCount = await redis.incr(CURRENT_COUNT_KEY);
    const likes = Number(await redis.get(LIKES_KEY)) || 0;
    return { currentCount, likes };
  }

  if (isProduction()) {
    console.error(
      "[stats] Upstash Redis is not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN in Vercel.",
    );
    return defaultStats();
  }

  const stats = await readStatsFromFile();
  stats.currentCount += 1;
  await writeStatsToFile(stats);
  return stats;
}

export async function incrementPortfolioLikes(): Promise<PortfolioStats> {
  const redis = getRedis();
  if (redis) {
    const likes = await redis.incr(LIKES_KEY);
    const currentCount = Number(await redis.get(CURRENT_COUNT_KEY)) || 0;
    return { currentCount, likes };
  }

  if (isProduction()) {
    console.error(
      "[stats] Upstash Redis is not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN in Vercel.",
    );
    return defaultStats();
  }

  const stats = await readStatsFromFile();
  stats.likes += 1;
  await writeStatsToFile(stats);
  return stats;
}
