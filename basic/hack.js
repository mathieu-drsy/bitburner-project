/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	while(true){
		const message = ns.getPortHandle(1).peek();
		if (!ns.getPortHandle(1).empty() && target !== message) {
			target = message;
		}
		await ns.hack(target);
	}
}