/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	await hackNodeManager(ns);
}

/**  @param {NS} ns **/
async function hackNodeManager(ns) {
	if (ns.hacknet.numNodes() === 0) { ns.print("Buy new node "); ns.hacknet.purchaseNode(); }
	while (true) {
		const cost = getMaxCost(ns);
		switch (cost[1]) {
			case null:
				break;
			case "level":
				ns.print("Buy ", cost[2], " level", cost[2] > 1 ? "s" : "", " for the node ", cost[3]);
				ns.hacknet.upgradeLevel(cost[3], cost[2]);
				break;
			case "ram":
				ns.print("Buy ram for the node ", cost[3]);
				ns.hacknet.upgradeRam(cost[3], cost[2]);
				break;
			case "core":
				ns.print("Buy core for the node ", cost[3]);
				ns.hacknet.upgradeCore(cost[3], cost[2]);
				break;
			case "new":
				ns.print("Buy new node ");
				ns.hacknet.purchaseNode();
				break;
		}
		await ns.sleep(50);
	}
}

/** 
 * @param {NS} ns
 * 
 **/
function getMaxCost(ns) {
	const maxMoney = getMaxMoney(ns);
	var growth = null;
	for (var i = 0; i < ns.hacknet.numNodes(); i++) {
		if ((growth == null || (growth[1] !== "level" && growth[0] > ns.hacknet.getLevelUpgradeCost(i, 1))) && ns.hacknet.getLevelUpgradeCost(i, 1) < maxMoney) {
			growth = [ns.hacknet.getLevelUpgradeCost(i, 1), "level", 1, i];
		}
		if (((growth == null || (growth[1] === "level" && (growth[0] < ns.hacknet.getLevelUpgradeCost(i, 10) || growth[3] == i)))) && ns.hacknet.getLevelUpgradeCost(i, 10) < maxMoney) {
			growth = [ns.hacknet.getLevelUpgradeCost(i, 10), "level", 10, i];
		}

		if ((growth == null || growth[0] > ns.hacknet.getRamUpgradeCost(i, 1)) && ns.hacknet.getRamUpgradeCost(i, 1) < maxMoney) {
			growth = [ns.hacknet.getRamUpgradeCost(i, 1), "ram", 1, i];
		}

		if ((growth == null || growth[0] > ns.hacknet.getCoreUpgradeCost(i, 1)) && ns.hacknet.getCoreUpgradeCost(i, 1) < maxMoney) {
			growth = [ns.hacknet.getCoreUpgradeCost(i, 1), "core", 1, i];
		}
	}
	if (ns.hacknet.numNodes() !== ns.hacknet.maxNumNodes() && (growth == null || growth[0] > ns.hacknet.getPurchaseNodeCost()) && ns.hacknet.getPurchaseNodeCost() < maxMoney) {
		growth = [ns.hacknet.getPurchaseNodeCost(), "new", 1, 1];
	}
	if (growth == null) { growth = [null, null, null]; }
	return growth;
}

/** 
 * to precise through formula
 * @param {NS} ns
 **/
function getMaxMoney(ns) {
	const servMoney = ns.getServerMoneyAvailable("home");
	if (servMoney < 10000000) {
		return servMoney * 0.00625;
	}
	if (servMoney < 500000000) {
		return servMoney * 0.003125;
	}
	if (servMoney < 1000000000) {
		return servMoney * 0.00128125;
	}
	return servMoney * 0.00065625;
}