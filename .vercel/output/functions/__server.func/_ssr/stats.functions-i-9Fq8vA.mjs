import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-LNPJ6T5I.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/stats.functions-i-9Fq8vA.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var STATS_FILE = path.join(process.cwd(), ".data", "portfolio-stats.json");
var defaultStats = () => ({
	visitors: 0,
	likes: 0
});
async function readStats() {
	try {
		const raw = await fs.readFile(STATS_FILE, "utf-8");
		const parsed = JSON.parse(raw);
		return {
			visitors: Number(parsed.visitors) || 0,
			likes: Number(parsed.likes) || 0
		};
	} catch {
		return defaultStats();
	}
}
async function writeStats(stats) {
	await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
	await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
}
async function getPortfolioStats() {
	return readStats();
}
async function incrementPortfolioVisitors() {
	const stats = await readStats();
	stats.visitors += 1;
	await writeStats(stats);
	return stats;
}
async function incrementPortfolioLikes() {
	const stats = await readStats();
	stats.likes += 1;
	await writeStats(stats);
	return stats;
}
var getStats_createServerFn_handler = createServerRpc({
	id: "1db1af4e539abe2b72416e116ff3a506da34e0ac6655ce979ab7e52d52f751b8",
	name: "getStats",
	filename: "src/lib/api/stats.functions.ts"
}, (opts) => getStats.__executeServer(opts));
var getStats = createServerFn({ method: "GET" }).handler(getStats_createServerFn_handler, async () => {
	return getPortfolioStats();
});
var incrementVisitor_createServerFn_handler = createServerRpc({
	id: "a01a6f3a6228a5c03b362eb89334e7545766d5df25cf6d1f7fd31c1d680b31e8",
	name: "incrementVisitor",
	filename: "src/lib/api/stats.functions.ts"
}, (opts) => incrementVisitor.__executeServer(opts));
var incrementVisitor = createServerFn({ method: "POST" }).handler(incrementVisitor_createServerFn_handler, async () => {
	return incrementPortfolioVisitors();
});
var incrementLike_createServerFn_handler = createServerRpc({
	id: "eecd12f427c473579cac927043f72cb208403bdf0df663eaa711a269e2afd7d5",
	name: "incrementLike",
	filename: "src/lib/api/stats.functions.ts"
}, (opts) => incrementLike.__executeServer(opts));
var incrementLike = createServerFn({ method: "POST" }).handler(incrementLike_createServerFn_handler, async () => {
	return incrementPortfolioLikes();
});
//#endregion
export { getStats_createServerFn_handler, incrementLike_createServerFn_handler, incrementVisitor_createServerFn_handler };
