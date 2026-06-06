import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-LNPJ6T5I.mjs";
import { t as Redis2 } from "../_libs/uncrypto+upstash__redis.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/stats.functions-Cf_xqMfi.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var VISITORS_KEY = "portfolio:visitors";
var LIKES_KEY = "portfolio:likes";
var STATS_FILE = path.join(process.cwd(), ".data", "portfolio-stats.json");
var defaultStats = () => ({
	visitors: 0,
	likes: 0
});
function getRedis() {
	const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
	if (!url || !token) return null;
	return new Redis2({
		url,
		token
	});
}
async function readStatsFromRedis(redis) {
	const [visitors, likes] = await redis.mget(VISITORS_KEY, LIKES_KEY);
	return {
		visitors: Number(visitors) || 0,
		likes: Number(likes) || 0
	};
}
async function readStatsFromFile() {
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
async function writeStatsToFile(stats) {
	await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
	await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
}
async function readStats() {
	const redis = getRedis();
	if (redis) return readStatsFromRedis(redis);
	return readStatsFromFile();
}
async function getPortfolioStats() {
	return readStats();
}
async function incrementPortfolioVisitors() {
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
async function incrementPortfolioLikes() {
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
