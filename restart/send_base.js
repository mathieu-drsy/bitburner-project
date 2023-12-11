import { basic, getPortUnlockable, getServerByPort } from "/util/var.js";
/** @param {NS} ns */
export async function main(ns) {
	ns.scp(await basic(ns), ns.args[0]);
}