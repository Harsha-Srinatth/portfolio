import { createServerFn } from "@tanstack/react-start";

import {
  getPortfolioStats,
  incrementCurrentCount,
  incrementPortfolioLikes,
} from "../stats.server";

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  return getPortfolioStats();
});

export const incrementOpen = createServerFn({ method: "POST" }).handler(async () => {
  return incrementCurrentCount();
});

export const incrementLike = createServerFn({ method: "POST" }).handler(async () => {
  return incrementPortfolioLikes();
});
