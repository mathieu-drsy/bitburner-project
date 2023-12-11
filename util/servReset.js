import { getServerByPort, getPortUnlockable } from "/util/var.js";
/** @param {NS} ns */
export async function reset(ns) {
	for (let i = 0; i <= await getPortUnlockable(ns); i++) {
		const servs = await getServerByPort(ns, i);
		for (var s of servs) {
			ns.killall(s);
			for (var f of ns.ls(s, "/basic/")) {
				ns.rm(f, s);
				await ns.sleep(200);
			}
		}
	}
}