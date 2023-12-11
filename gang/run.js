/** @param {NS} ns */
export async function main(ns) {
	getSilent(ns);
	while (true) {
		const form = ns.fileExists("Formulas.exe");
		const hackingGang = ns.gang.getGangInformation().isHacking;
		const myGang = ns.gang.getGangInformation();
		if (ns.gang.canRecruitMember()) {
			const member = ns.gang.getMemberNames();
			if(member.length!=0){
				ns.gang.recruitMember("Scrub-" + (member[member.length - 1].split("-")[1] + 5471).toString().padStart(4, '0'));
			}else{
				ns.gang.recruitMember("Scrub-" + (member.length + 5471).toString().padStart(4, '0'));
			}
		}

		ns.gang.getMemberNames().forEach(el => {
			const memberInfo = ns.gang.getMemberInformation(el);
			const task = ns.gang.getTaskNames();
			var bestTask = memberInfo.task !== "Unassigned" ? [memberInfo.task, calculTask(ns, memberInfo.task, form, memberInfo)] : null;
			const otherGang = ["Slum Snakes", "Speakers for the Dead",
				"Tetrads", "The Syndicate",
				"The Dark Army", "NiteSec", "The Black Hand"];
			if (ns.gang.getGangInformation().territoryClashChance !== 0 && otherGang.filter(other => { return myGang.faction !== other && ns.gang.getChanceToWinClash(other) < 0.95 && ns.gang.getOtherGangInformation()[other] !== undefined && ns.gang.getOtherGangInformation()[other].territory > 0; }).length > 0) {
				bestTask = ["Territory Warfare"];
			} else if (ns.gang.getGangInformation().territoryClashChance === 0) {
				task.forEach(t => {
					const stat = ns.gang.getTaskStats(t);
					if (form) {
						const calcGain = calculTask(ns, t, form, memberInfo);
						if ((memberInfo.task.includes("Train") && t === memberInfo.task) || (notEssential(memberInfo) && !t.includes("Unassigned") && (!hackingGang && stat.isCombat || hackingGang && !stat.isCombat) && (bestTask === null || calcGain > bestTask[1]))) {
							bestTask = [t, calculTask(ns, t, form, memberInfo)];
						}
					} else {
						const calc = calculTask(ns, t, form, memberInfo);
						if ((memberInfo.task.includes("Train") && t === memberInfo.task) || (notEssential(memberInfo) && !t.includes("Unassigned") && (!hackingGang && stat.isCombat || hackingGang && !stat.isCombat) && (bestTask === null || calc > bestTask[1]))) {
							bestTask = [t, calculTask(ns, t, form, memberInfo)];
						}
					}
				});
			}
			const equipmentCostMax = function (ns) { return ns.getServerMoneyAvailable("home") * 0.0005; }
			ns.gang.getEquipmentNames().filter(eq => {
				return !ns.gang.getMemberInformation(el).upgrades.includes(eq)
					&& !ns.gang.getMemberInformation(el).augmentations.includes(eq)
					&& equipmentCostMax(ns) > ns.gang.getEquipmentCost(eq);
			}).forEach(eq => {
				if (equipmentCostMax(ns) > ns.gang.getEquipmentCost(eq)) {
					ns.gang.purchaseEquipment(el, eq);
				}
			});
			if (bestTask != null && memberInfo.task !== bestTask[0]) {
				ns.gang.setMemberTask(el, bestTask[0]);
			}
			const numToAsc = 2;
			const asc = ns.gang.getAscensionResult(el);
			if (asc !== undefined && (asc.agi > numToAsc || asc.cha > numToAsc || asc.def > numToAsc || asc.dex > numToAsc || asc.str > numToAsc || asc.hack > numToAsc)) {
				ns.gang.ascendMember(el);
			}
		});

		await ns.sleep(100);
	}
}

/**
 * @param {NS} ns 
 * @param {String} t 
 * @param {boolean} form 
*/
function calculTask(ns, t, form, memberInfo) {
	const stat = ns.gang.getTaskStats(t);
	if (form) {
		const monGain = ns.formulas.gang.moneyGain(ns.gang.getGangInformation(), memberInfo, stat);
		const respGain = ns.formulas.gang.respectGain(ns.gang.getGangInformation(), memberInfo, stat);
		const wantGain = ns.formulas.gang.wantedLevelGain(ns.gang.getGangInformation(), memberInfo, stat);
		return wantGain === 0 ? (monGain * respGain) - 100 : (monGain + respGain) - wantGain * 100;
	} else {
		return stat.baseWanted === 0 ? (stat.baseMoney + stat.baseRespect) - 100 : (stat.baseMoney + stat.baseRespect) - stat.baseWanted * 100;
	}
}


function notEssential(memberInfo) {
	return !memberInfo.task.includes("Territory Warfare") && !memberInfo.task.includes("Train");
}


function getSilent(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	ns.disableLog("getServerMoneyAvailable");
}