export function basic(ns) { return ns.ls("home", "/basic/"); }

export async function recursiveServ(ns, listServ) {
	const toCompare = listServ.filter(el => true);
	listServ.filter(el => {
		return el != "home" && ns.scan(el).length > 1
	}).forEach((el) => {
		ns.scan(el).filter((value) => {
			return (value != "home" && !listServ.includes(value));
		}).forEach((lasvalue) => {
			listServ.push(lasvalue);
		})
	});
	if (!_.isEqual(toCompare, listServ)) {
		listServ = recursiveServ(ns, listServ);
	}
	return listServ;
}

export async function getAllServ(ns) { return recursiveServ(ns, ns.scan("home")); }

async function getServerBy(ns, port, by) {
	const serveurs = await getAllServ(ns);
	return serveurs.filter(el => (ns.serverExists(el) && by === "by" ? ns.getServerNumPortsRequired(el) === port : ns.getServerNumPortsRequired(el) <= port));
}

export async function getServerByPort(ns, port) { return await getServerBy(ns, port, "by"); }

export async function getServerUntilPort(ns, port) { return await getServerBy(ns, port, "until"); }


export async function getServerWithPower(ns, servs) {
	var result = [];
	await servs.forEach(el => result.push([el, ns.getServerMaxRam(el) - ns.getServerUsedRam(el)]));
	return result.sort(function (a, b) { return a[1] - b[1] });
}

export async function getPortUnlockable(ns) {
	var i = 0;
	if (ns.fileExists("BruteSSH.exe", "home")) { i++; }
	if (ns.fileExists("FTPCrack.exe", "home")) { i++; }
	if (ns.fileExists("relaySMTP.exe", "home")) { i++; }
	if (ns.fileExists("HTTPWorm.exe", "home")) { i++; }
	if (ns.fileExists("SQLInject.exe", "home")) { i++; }
	return i;
}


export async function getPath(ns, targ) {
	var result = await findPath(ns, targ, "home", [], []);
	result.push("home");
	return result;
}

/** @param {NS} ns */
function findPath(ns, targ, src, path, already) {
	if(already.includes(src)){return [];}
	const toScan = ns.scan(src);
	already.push(src);
	if(toScan.length<1){ return [];}
	for(let serv of toScan){
		if(!already.includes(serv)){
			if (serv === targ) {
				path.push(serv);
				return path;
			}
			var res = getPath(ns, targ, serv, path, already);
			if (res.length > 0) {
				res.push(src);
				return res;
			}
		}
	}
	return [];
}

export async function compareServer(ns, servers){
	const form = ns.fileExists("Formulas.exe");
	const potential = servers;
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