import { testPort } from "/basic/base_fun.js";
/** @param {NS} ns */
export async function secureServ(ns, target) {
	await testPort(ns, target);
	ns.nuke(target);
}