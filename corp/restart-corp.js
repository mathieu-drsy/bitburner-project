/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("disableLog"); ns.disableLog("sleep");

	if(!ns.corporation.hasCorporation()){
		ns.corporation.createCorporation("Mahieuhieu&Co");
	}

	if(!ns.corporation.getCorporation().divisions.length > 0){
		await setup(ns);
	}
	
	await timeToGrow(ns);
}

/**
 * @param {NS} ns
 */
async function timeToGrow(ns){
	const upgrades = ["FocusWires","Neural Accelerators", "Speech Processor Implants", 
	"Nuoptimal Nootropic Injector Implants", "Smart Factories"]
	for(var upgrade of upgrades){
		await wait(ns, upgrade);
		ns.corporation.levelUpgrade(upgrade);
		await wait(ns, upgrade);
		ns.corporation.levelUpgrade(upgrade);
	}

	
}


/**
 * @param {NS} ns
 */
async function setup(ns){
	const divName = "ToxicPotatoesBio";
	if(!ns.corporation.getCorporation().divisions.includes(divName)){
		ns.corporation.expandIndustry("Agriculture", divName);
	}
	
	if(!ns.corporation.hasUnlock("Smart Supply")){
		ns.corporation.purchaseUnlock("Smart Supply");
	}
	ns.corporation.setSmartSupply(divName, "Sector-12", true);
	for(var city in CityName){
		if(!ns.corporation.getDivision(divName).cities.includes(city)){
			ns.corporation.expandCity(divName, city)
		}
		for(var position of ["Operations", "Engineer", "Business"]){
			ns.corporation.hireEmployee(divName, city, position);
		}
	}
	ns.corporation.hireAdVert(divName);
	for(var city in CityName){
		if(!ns.corporation.hasWarehouse(divName, city)){
			ns.corporation.getWarehouse(divName, city);
		}
		while(ns.corporation.getWarehouse(divName, city).size<300){
			ns.corporation.upgradeWarehouse(divName, city)
		}
		ns.corporation.sellMaterial(divName, city, "Plants and Food", "MAX", "MP");
	}
}

/**
 * @param {NS} ns
 */
async function wait(ns, update){
	while(ns.corporation.getUpgradeLevelCost(update)>ns.corporation.getCorporation().funds){ ns.sleep(5000); }
}