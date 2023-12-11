import { htmlManager } from "/util/html/basic_injection.js";
import { getBestTarget } from "/util/manager/servManager.js";
/** @param {NS} ns */
export async function main(ns) {
	ns.args[0] = (await getBestTarget(ns))[0];
	if (typeof ns.args[0] === 'undefined') { throw Error("Please input target."); }
	ns.disableLog("sleep");
	ns.disableLog("getServerMoneyAvailable");
	var server = false;
	var hackNode = ns.isRunning("/util/hacknet/hacknode.js") ? true : false;
	while (true) {
		const money = ns.getServerMoneyAvailable("home");
		if (hackNode && server) { break; }

		if (money > 23000000 && !hackNode) { ns.exec("/util/hacknet/hacknode.js", "home", 1); hackNode = true; }

		if (!server) {
			var change = false;
			if (serverTest(ns, money, undefined)) { ns.args[1] = await restartServer(ns, 16); }
			if (serverTest(ns, money, 16)) { ns.args[1] = await restartServer(ns, 128); }
			if (serverTest(ns, money, 128)) { ns.args[1] = await restartServer(ns, 1024); }
			if (serverTest(ns, money, 1024)) { ns.args[1] = await restartServer(ns, 8192); server = true; }
		}
		await ns.sleep(10000);
	}
	ns.print("work is done bozo.");
	ns.tprint("work is done bozo.");
}

function serverTest(ns, money, test) {
	if (money > 15000000000 && ns.args[1] === 1024 && test === 1024) { return true; }
	if (money > 2500000000 && ns.args[1] === 128 && test === 128) { return true; }
	if (money > 500000000 && ns.args[1] === 16 && test === 16) { return true; }
	if (money > 10000000 && ns.args[1] === undefined && test === undefined) { return true; }
	return false;
}

/** @param {NS} ns */
async function restartServer(ns, change) {
	const script = ns.ps("home").filter(el => el === "restart/server/server_run.js");
	if (script.length === 0 || script[0].args[1] < change) {
		ns.scriptKill("restart/server/server_run.js", "home");
		ns.exec("restart/server/server_run.js", "home", 1, (await getBestTarget(ns))[0], change);
		ns.print("Running server manager as ", change, " ram/server.");
		ns.tprint("Running server manager as ", change, " ram/server.");
		return change;
	} else {
		return script[0].args[1];
	}
}