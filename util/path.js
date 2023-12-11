function findPath (ns, target, serverName, serverList, ignore, isFound) {
	ignore.push(serverName);
	let scanResults = ns.scan(serverName);
	for (let server of scanResults) {
		if (ignore.includes(server)) {
			continue;
		}
		if (server === target) {
			serverList.push(server);
			return [serverList, true];
		}
		serverList.push(server);
		const result = findPath(ns, target, server, serverList, ignore, isFound);
		if (result [1]) {
			return result;
		}
		serverList.pop();
	}
	return [serverList, false];
}


/** @param {NS} ns **/
export function getPath(ns) {
	let startServer = ns.getHostname();
	let target = ns.args[0];
	if (target === undefined) {
		ns.alert('Please provide target server');
		return;
	}
	let res = findPath(ns, target, startServer, [], [], false);
	if (!res[1]) {
		ns.alert('Server not found!');
	} else {
		res[0].unshift(startServer);
		ns.tprint(res[0].join(' --> '));
	}
}