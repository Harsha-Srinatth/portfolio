import { incrementOpen } from "@/lib/api/stats.functions";
import type { PortfolioStats } from "@/lib/api/stats-api";

/*
 * A visit is one page open (unchanged from the original definition). The
 * request is memoised at module level so React Strict Mode double effects,
 * hot reloads and component remounts can never count the same open twice.
 */
let visit: Promise<PortfolioStats> | null = null;

export function recordVisitOnce(): Promise<PortfolioStats> {
  if (!visit) {
    visit = incrementOpen().catch((error: unknown) => {
      visit = null;
      throw error;
    });
  }
  return visit;
}
