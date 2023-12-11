/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("exec");
	ns.exec("/util/req_reb.js", "home", 1);
	ns.exec("/gang/run.js", "home", 1);
	ns.exec("/sleeves/run.js", "home", 1);
}