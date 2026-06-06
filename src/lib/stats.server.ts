import fs from "node:fs/promises";
import path from "node:path";

import { Redis } from "@upstash/redis";

type PortfolioStats = {
  visitors: number;
  likes: number;
};

const VISITORS_KEY = "portfolio:visitors";
const LIKES_KEY = "portfolio:likes";
const STATS_FILE = path.join(process.cwd(), ".data", "portfolio-stats.json");

const defaultStats = (): PortfolioStats => ({
  visitors: 0,
  likes: 0,
});

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function readStatsFromRedis(redis: Redis): Promise<PortfolioStats> {
  const [visitors, likes] = await redis.mget<number>(VISITORS_KEY, LIKES_KEY);
  return {
    visitors: Number(visitors) || 0,
    likes: Number(likes) || 0,
  };
}

async function readStatsFromFile(): Promise<PortfolioStats> {
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

async function writeStatsToFile(stats: PortfolioStats) {
  await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
}

async function readStats(): Promise<PortfolioStats> {
  const redis = getRedis();
  if (redis) return readStatsFromRedis(redis);
  return readStatsFromFile();
}

export async function getPortfolioStats() {
  return readStats();
}

export async function incrementPortfolioVisitors() {
  const redis = getRedis();
  if (redis) {
    await redis.incr(VISITORS_KEY);
    return readStatsFromRedis(redis);
  }

  const stats = await readStatsFromFile();
  stats.visitors += 1;
  await writeStatsToFile(stats);
  return stats;
}

export async function incrementPortfolioLikes() {
  const redis = getRedis();
  if (redis) {
    await redis.incr(LIKES_KEY);
    return readStatsFromRedis(redis);
  }

  const stats = await readStatsFromFile();
  stats.likes += 1;
  await writeStatsToFile(stats);
  return stats;
}
