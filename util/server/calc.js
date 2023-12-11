/**
* @param {NS} ns
* @param {RAM} ram
* @param {PROG} prog
**/
export function threadCalc(ns, ram, prog) {
	const denominateur = ns.getScriptRam(prog, "home");
	if(denominateur<=0){return 0;}
	return Math.floor(ram/denominateur);
}