/** @param {NS} ns */
export async function main(ns) {
	runMarket(ns);
}

export async function runMarket(ns) {
	ns.exec("/util/market/buyer.js","home", 1);
	ns.exec("/util/market/buyer.js","home", 1);
}