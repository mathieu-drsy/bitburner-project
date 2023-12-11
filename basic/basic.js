import { testPort, basicTrinity } from "/basic/base_fun.js";
/**
 * @param {NS} ns
 **/
export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.9;
    var securityThresh = ns.getServerMinSecurityLevel(target) * 1.01;

    // Infinite loop that continously hacks/grows/weakens the target server
    while (true) {
        const message = ns.getPortHandle(1).peek();
        if (!ns.getPortHandle(1).empty() && target !== message) {
            target = message;
            moneyThresh = ns.getServerMaxMoney(target) * 0.9;
            securityThresh = ns.getServerMinSecurityLevel(target) * 1.01;
        }
        await basicTrinity(ns, target, securityThresh, moneyThresh);
    }
}