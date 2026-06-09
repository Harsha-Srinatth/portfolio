import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Redis2 } from "../_libs/uncrypto+upstash__redis.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/router-qZ201IeW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DOZkyoXH.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$2 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Ryali Harsha Srinatth — Full-Stack Engineer" },
			{
				name: "description",
				content: "Portfolio of Ryali Harsha Srinatth — full-stack engineering, MERN systems, and machine learning."
			},
			{
				name: "author",
				content: "Ryali Harsha Srinatth"
			},
			{
				property: "og:title",
				content: "Ryali Harsha Srinatth — Full-Stack Engineer"
			},
			{
				property: "og:description",
				content: "An interactive observatory of projects, experiments, signals and ideas."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$2.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter = () => import("./routes-DCyI30rs.mjs");
var Route$1 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Ryali Harsha Srinatth — Full-Stack Engineer" },
		{
			name: "description",
			content: "Portfolio of Ryali Harsha Srinatth (Harsha) — CSBS undergraduate from Bhimavaram, AP. Full-stack, MERN, and machine learning engineering."
		},
		{
			property: "og:title",
			content: "Ryali Harsha Srinatth — Full-Stack Engineer"
		},
		{
			property: "og:description",
			content: "Backend · Full-stack · AI engineering. Built by hand."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var VISITORS_KEY = "visitors";
var LIKES_KEY = "likes";
var STATS_FILE = path.join(process.cwd(), ".data", "portfolio-stats.json");
var defaultStats = () => ({
	visitors: 0,
	likes: 0
});
function getRedis() {
	const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? process.env.STORAGE_UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? process.env.STORAGE_UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) return null;
	return new Redis2({
		url,
		token
	});
}
function isProduction() {
	return true;
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
	if (redis) return {
		visitors: await redis.incr(VISITORS_KEY),
		likes: Number(await redis.get(LIKES_KEY)) || 0
	};
	if (isProduction()) {
		console.error("[stats] Upstash Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.");
		return defaultStats();
	}
	const stats = await readStatsFromFile();
	stats.visitors += 1;
	await writeStatsToFile(stats);
	return stats;
}
async function incrementPortfolioLikes() {
	const redis = getRedis();
	if (redis) {
		const likes = await redis.incr(LIKES_KEY);
		return {
			visitors: Number(await redis.get(VISITORS_KEY)) || 0,
			likes
		};
	}
	if (isProduction()) {
		console.error("[stats] Upstash Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.");
		return defaultStats();
	}
	const stats = await readStatsFromFile();
	stats.likes += 1;
	await writeStatsToFile(stats);
	return stats;
}
var Route = createFileRoute("/api/stats")({ server: { handlers: {
	GET: async () => {
		const stats = await getPortfolioStats();
		return Response.json(stats, { headers: { "cache-control": "no-store" } });
	},
	POST: async ({ request }) => {
		let action;
		try {
			action = (await request.json()).action;
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
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	ApiStatsRoute: Route.update({
		id: "/api/stats",
		path: "/api/stats",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
