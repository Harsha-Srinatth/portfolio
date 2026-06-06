import { createServerFn } from "@tanstack/react-start";

import {
  getPortfolioStats,
  incrementPortfolioLikes,
  incrementPortfolioVisitors,
} from "../stats.server";

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  return getPortfolioStats();
});

export const incrementVisitor = createServerFn({ method: "POST" }).handler(async () => {
  return incrementPortfolioVisitors();
});

export const incrementLike = createServerFn({ method: "POST" }).handler(async () => {
  return incrementPortfolioLikes();
});
