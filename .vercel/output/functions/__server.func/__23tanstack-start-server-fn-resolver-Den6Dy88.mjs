//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Den6Dy88.js
var manifest = {
	"1db1af4e539abe2b72416e116ff3a506da34e0ac6655ce979ab7e52d52f751b8": {
		functionName: "getStats_createServerFn_handler",
		importer: () => import("./_ssr/stats.functions-Cf_xqMfi.mjs")
	},
	"a01a6f3a6228a5c03b362eb89334e7545766d5df25cf6d1f7fd31c1d680b31e8": {
		functionName: "incrementVisitor_createServerFn_handler",
		importer: () => import("./_ssr/stats.functions-Cf_xqMfi.mjs")
	},
	"eecd12f427c473579cac927043f72cb208403bdf0df663eaa711a269e2afd7d5": {
		functionName: "incrementLike_createServerFn_handler",
		importer: () => import("./_ssr/stats.functions-Cf_xqMfi.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
