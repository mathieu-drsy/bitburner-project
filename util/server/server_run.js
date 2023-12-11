import { basic } from "/util/var.js";
import { delete_serv } from "/util/server/delete.js";
import { threadCalc } from "/util/server/calc.js";
import { htmlManager } from "/util/html/basic_injection.js";
/**
 * @param {NS} ns
 **/
export async function main(ns) {
    // How much RAM each purchased server will have. In this case, it'll
    // be 8GB.
    if (typeof ns.args[0] === 'undefined' || typeof ns.args[1] === 'undefined') { htmlManager(ns, "fail"); throw Error("Please input target."); }
    ns.disableLog("sleep");
    const ram = ns.args[1];
    const runner = "/basic/basic.js";
    await delete_serv(ns, ram);
    // Iterator we'll use for our loop
    var i = ns.getPurchasedServers().length;
    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (i < ns.getPurchasedServerLimit()) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            var hostname = ns.purchaseServer("pserv-" + i, ram);
            ns.scp(basic(ns), hostname);
            const thread = await threadCalc(ns, ram, runner);
            if (thread > 0) { ns.exec(runner, hostname, thread, ns.args[0]); }
            ++i;
        }
        await ns.sleep(100);
    }
    await htmlManager(ns, "success");
    ns.tprint("All servers are up.")
}