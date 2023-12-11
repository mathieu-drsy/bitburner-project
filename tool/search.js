import { getPath } from "/util/path.js";
import { getBestTarget } from "/util/manager/servManager.js";
import { notifBasic, notif } from "/util/sound/notif.js";
/** @param {NS} ns */
export async function main(ns) {
	//await htmlManager(ns, "test");
	
	//*
	if(ns.args[0]!==undefined){
		if(ns.args[0]==="karma" || ns.args[0]==="k"){
			ns.tprint(ns.heart.break()); //karma
		}else{
			await getPath(ns);
		}
	}else{
		await getTarget(ns);
	}
	//*/
}
/** @param {NS} ns */

async function getTarget(ns){
	const serv = await getBestTarget(ns);
	ns.tprint(serv);
	if(!ns.getServer(serv[0]).backdoorInstalled){
		ns.tprint("Install backdoor please.");
		ns.args[0]= serv[0];
		await getPath(ns);
		notifBasic();
	}
	else {
		ns.tprint("Backdoor already installed.")
	}
}
//*/

export function autocomplete(data, args) {
	return [...data.servers, "karma"];
}