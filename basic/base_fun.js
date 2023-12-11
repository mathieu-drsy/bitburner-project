/**
* @param {NS} ns
* @param {TARGET} target
**/
export async function testPort(ns, target) {
	if (ns.fileExists("BruteSSH.exe")) {
		ns.brutessh(target);
	}
	if (ns.fileExists("FTPCrack.exe")) {
		ns.ftpcrack(target);
	}
	if (ns.fileExists("relaySMTP.exe")) {
		ns.relaysmtp(target);
	}
	if (ns.fileExists("HTTPWorm.exe")) {
		ns.httpworm(target);
	}
	if (ns.fileExists("SQLInject.exe")) {
		ns.sqlinject(target);
	}
	await ns.sleep(50);
}


/**
* @param {NS} ns
* @param {TARGET} target
* @param {SECURITYTHRESH} securityThresh
* @param {MONEYTHRESH} moneyThresh
**/
export async function basicTrinity(ns, target, securityThresh, moneyThresh){
	if (ns.getServerSecurityLevel(target) > securityThresh) {
        await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
		await ns.grow(target);
    } else {
		await ns.hack(target);
    }
}