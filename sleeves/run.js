/** @param {NS} ns */
export async function main(ns) {
	getSilent(ns);
	while (true) {
		const form = ns.fileExists("Formulas.exe");
		const moneyThresh = function () { return ns.getServerMoneyAvailable("home") * 0.001; };

		var sleeveNumber = ns.sleeve.getNumSleeves() + 1;
		while (--sleeveNumber) {
			const numOfActualSleeve = sleeveNumber - 1;
			const guy = ns.sleeve.getSleeve(numOfActualSleeve);
			if (guy.shock > 96 || guy.sync !== 100) {
				if (guy.shock > 96 && guy.sync === 100) {
					ns.sleeve.setToShockRecovery(numOfActualSleeve);
				} else {
					ns.sleeve.setToSynchronize(numOfActualSleeve);
				}
			} else {
				if (guy.shock === 0) {
					ns.sleeve.getSleevePurchasableAugs(numOfActualSleeve).forEach(aug => {
						if (aug.cost < moneyThresh()) {
							ns.sleeve.purchaseSleeveAug(numOfActualSleeve, aug.name);
						}
					});
				}
				var task = ns.sleeve.getTask(numOfActualSleeve);
				if (task === null ||
					((task.type === "RECOVERY" || task.type === "SYNCHRO") && guy.shock > 96 && guy.sync === 100) ||
					task.type.includes("CRIME")) {
					if(ns.gang.inGang()){
						if (form) {
							var crimeToDo = null;
							for (const c of crimes) {
								if (crimeToDo === null) { crimeToDo = [c, ns.formulas.work.crimeGains(guy, c).money * ns.formulas.work.crimeSuccessChance(guy, c)]; }
								if (ns.formulas.work.crimeGains(guy, c).money * ns.formulas.work.crimeSuccessChance(guy, c) > crimeToDo[1]) { crimeToDo = [c, ns.formulas.work.crimeGains(guy, c).money * ns.formulas.work.crimeSuccessChance(guy, c)]; }
							}
							if (task !== crimeToDo[0]) { ns.sleeve.setToCommitCrime(numOfActualSleeve, crimeToDo[0]); }
						} else {
							if (guy.skills.strength < 100) {
								ns.sleeve.setToCommitCrime(numOfActualSleeve, "Mug");
							} else {
								ns.sleeve.setToCommitCrime(numOfActualSleeve, "Homicide");//for now just lowering karma for gang
							}
						}
					}else{
						if (guy.skills.strength < 100) {
							ns.sleeve.setToCommitCrime(numOfActualSleeve, "Mug");
						} else {
							ns.sleeve.setToCommitCrime(numOfActualSleeve, "Homicide");//for now just lowering karma for gang
						}
					}
				} else if (task.type === "RECOVERY" || task.type === "SYNCHRO") {
					if (guy.shock > 96 || guy.sync !== 100) {
						if (guy.shock > 96 && guy.sync === 0) {
							if (task.type === "RECOVERY") { ns.sleeve.setToShockRecovery(numOfActualSleeve); }
						} else {
							if (task.type === "SYNCHRO") { ns.sleeve.setToSynchronize(numOfActualSleeve); }
						}
					} else {
						ns.sleeve.setToIdle(numOfActualSleeve);
					}
				}
			}
		}
		await ns.sleep(1000);
	}
}

const crimes = [
	"shoplift",
	"rob store",
	"mug",
	"larceny",
	"deal drugs",
	"bond forgery",
	"traffick arms",
	"homicide",
	"grand theft auto",
	"kidnap",
	"assassinate",
	"heist"
];

/** @param {NS} ns */
function getSilent(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
}