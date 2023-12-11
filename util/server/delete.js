/** @param {NS} ns */
export function delete_serv(ns, ram) {
    var purchasedServ = ns.getPurchasedServers();
    for (var p of purchasedServ) {
        if (ns.getServerMaxRam(p) < ram) {
            ns.killall(p);
            ns.deleteServer(p);
        }
    }
}