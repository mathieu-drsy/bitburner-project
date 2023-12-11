//import {getAllServ} from "/util/var.js";
//ns.tprint(await getAllServ(ns));
//JSON.stringify(await getServerUntilPort(ns, ns.args[0]));
//JSON.parse(ns.getPortHandle(1).peek());
import { reset } from "/util/servReset.js";
import { getServerUntilPort, getPortUnlockable } from "/util/var.js";
import { call } from "/util/html/caller.js";
import { htmlManager } from "/util/html/basic_injection.js";
import { delete_serv } from "/util/server/delete.js";
import { getPath } from "/util/path.js";
import { getBestTarget } from "/util/manager/servManager.js";
import { notifBasic, notif } from "/util/sound/notif.js";
/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(ns.sleeve.getSleeve(ns.sleeve.getNumSleeves()-1).shock);	
	//await htmlManager(ns, "test");	
	
		
}

export function autocomplete(data, args) {
	return [...data.servers];
}