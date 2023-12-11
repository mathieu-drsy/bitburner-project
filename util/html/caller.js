import { htmlManager } from "/util/html/basic_injection.js";
/** @param {NS} ns */
export async function main(ns) {
	if(ns.args[0]!==undefined){
		await htmlManager(ns, ns.args[0]);
	}
}

/** 
 * @param {NS} ns
 * @param {String} type
 **/
export async function call(ns, type) {
	var call=false;
	while(!call){
		const script = ns.ps("home").filter(el => el === "/util/html/caller.js");
		if(script.length === 0){
			ns.exec("/util/html/caller.js", "home", 1, type);
			call=true;
		}else{
			await ns.sleep(10);
		}
	}

}