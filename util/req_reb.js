import { basic, getPortUnlockable, getServerByPort } from "/util/var.js";
import { htmlManager } from "/util/html/basic_injection.js";
import { threadCalc } from "/util/server/calc.js";
import { testPort } from "/basic/base_fun.js";
import { reset } from "/util/servReset.js";
import { secureServ } from "/util/util_fun.js";
import { getBestTarget } from "/util/manager/servManager.js";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.args[0] = (await getBestTarget(ns))[0];
    if (typeof ns.args[0] === 'undefined' || !ns.serverExists(ns.args[0])) { await htmlManager(ns, "fail"); throw Error("Please input target."); }
    if (ns.getServerNumPortsRequired(ns.args[0]) > await getPortUnlockable(ns)) { await htmlManager(ns, "fail"); throw Error("Please input correct target (not enough port to unlock)."); }
    await secureServ(ns, ns.args[0]);
    await htmlManager(ns, "wait");
    resetServerScript(ns);
    await reset(ns);
    ns.exec("/util/manager/moneyManager.js", "home", 1);
    ns.exec("/util/manager/servManager.js", "home", 1);
    for (let p = 0; p <= 5; p++) {
        const resp = await terminateServer(ns, p, "/basic/basic.js");
        ns.tprint("Servers up to " + p + " have been infected.");
        while (await getPortUnlockable(ns) < (p + 1 <= 5 ? p + 1 : 5) && resp === true) {
            await ns.sleep(10000);
        }
    }
    await htmlManager(ns, "success");
    ns.tprint("All network infected.");
}

/** @param {NS} ns */
async function terminateServer(ns, port, runner) {
    var mesServs = await getServerByPort(ns, port);
    for (var i of mesServs) {
        if (!(ns.hasRootAccess(i))) {
            await testPort(ns, i);
            ns.nuke(i);
        }
        ns.killall(i);
        if (await basic(ns).filter(el => ns.fileExists(el, i)).length === 0) {
            await ns.sleep(50);
            ns.scp(await basic(ns), i);
        }
        const thread = await threadCalc(ns, ns.getServerMaxRam(i) - ns.getServerUsedRam(i), runner);
        if (thread > 0) {
            ns.exec(runner, i, thread, ns.args[0]);
        }
    }
    return true;
}

/** @param {NS} ns */
function resetServerScript(ns) {
    const process = ns.ps("home");
    for (var i of process) {
        if (i.pid !== ns.pid 
				&& i.filename!=="restart/all.js"	
				&& i.filename!=="gang/run.js" 
				&& i.filename!=="sleeves/run.js") { 
					ns.kill(i.pid);
				}
    }
}

/** @param {NS} ns */
function unlockOther(ns){
    if(!ns.hasTorRouter()){
        return;
    }
    //to implement
}