import { getPortUnlockable, getServerUntilPort, getServerWithPower } from "/util/var.js";
import { secureServ } from "/util/util_fun.js";
import { notifBasic } from "/util/sound/notif.js";
/** 
 * [1]=hack
 * [2]=grow
 * [3]=weaken
 */
/** @param {NS} ns */
export async function main(ns) {
	silenceUselessLog(ns);
	//var mesServ = await getServerWithPower(ns, await updateServs(ns));
	//var port = await getPortUnlockable(ns);
	var target;
	ns.getPortHandle(1).clear()
	//var message;
	while (true) {
		target = (await getBestTarget(ns));
		/*
		const portUnlockable = await getPortUnlockable(ns);
		if (port != portUnlockable) {
			port = portUnlockable;
			mesServ = await getServerWithPower(ns, await updateServs(ns));
		}
		*/
		if (ns.getPortHandle(1).empty() || ns.getPortHandle(1).peek() !== target[0]) {
			if (!ns.hasRootAccess(target[0])) { await secureServ(ns, target[0]); }
			ns.getPortHandle(1).clear();
			ns.getPortHandle(1).tryWrite(target[0]);
			ns.print("New target : ", target[0], " | score : ", target[1]);
			ns.tprint("New target : ", target[0], " | score : ", target[1]);
			if(!ns.getServer(target[0]).backdoorInstalled){
				ns.tprint("Install backdoor please.")
				notifBasic();
			}
		}
		await ns.sleep(5000);
	}
}

/** @param {NS} ns */
export async function getBestTarget(ns) {
	const form = ns.fileExists("Formulas.exe");
	const potential = await getServerUntilPort(ns, await getPortUnlockable(ns));
	var result = null;
	await potential.forEach(el => {
		var mon = ns.getServerMaxMoney(el);
		var denominateur;
		if (form) {
			var servChance = ns.getServer(el);
			servChance.hackDifficulty = servChance.minDifficulty;
			servChance.moneyAvailable = servChance.moneyMax;
			servChance.backdoorInstalled = true;
			denominateur = ns.formulas.hacking.hackTime(servChance, ns.getPlayer()) + ns.formulas.hacking.growTime(servChance, ns.getPlayer()) + ns.formulas.hacking.weakenTime(servChance, ns.getPlayer());
			mon *= ns.formulas.hacking.hackChance(servChance, ns.getPlayer()) * ns.formulas.hacking.hackPercent(servChance, ns.getPlayer());
		} else {
			denominateur = ns.getServerMinSecurityLevel(el) ;
		}
		const capacity = (mon / denominateur);
		if ((result == null || result[1] < capacity) && ns.getServerRequiredHackingLevel(el) <= ns.getHackingLevel()) { result = [el, capacity]; }
	});
	return result;
}

/** @param {NS} ns */
async function updateServs(ns) {
	return ns.getPurchasedServers().concat(await getServerUntilPort(ns, await getPortUnlockable(ns)));
}

/** @param {NS} ns */
function calcAttack(ns, target, servs) {
	const testServSec = ns.getServerBaseSecurityLevel(target[1]);
	const servSecThresh = testServSec * 1.01 >= 100 ? 100 : testServSec * 1.01;//1% more security allowed
	const servMonThresh = ns.getServerMaxMoney(target[1]) * 0.9;//90% money

}

function silenceUselessLog(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("getServerRequiredHackingLevel");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerNumPortsRequired");
	ns.disableLog("getHackingLevel");
	ns.disableLog("sleep");
	ns.disableLog("scan");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerMinSecurityLevel");
}