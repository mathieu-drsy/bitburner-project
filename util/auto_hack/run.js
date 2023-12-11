import { secureServ } from "/util/util_fun.js";
import { threadCalc } from "/util/server/calc.js";
import { basic, getPortUnlockable, getServerUntilPort } from "/util/var.js";
/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog('ALL');
  ns.enableLog('print');
  var options = ns.flags([
    ['kill', false],
    ['hack', false],
    ['grow', false],
    ['weaken', false],
    ['waitTime', 10],
    ['help', false]
  ]);

  if (options['help']) {
    ns.tail();
    ns.print(`Auto-script, options:
    * --kill: Force kill every other process on every servers
    * --hack some-script.js: Replace hack script with some-script.js one
    * --grow some-script.js: Replace grow script with some-script.js one
    * --weaken some-script.js: Replace weaken script with some-script.js one
    * --waitTime 10: Wait time between two servers in ms, must be higher than 1
    * --help: show this message
    `);
    return;
  }
  // Creating scripts
  var hack = options['hack'] || '/temp/hack.js',
    grow = options['grow'] || '/temp/grow.js',
    weaken = options['weaken'] || '/temp/weaken.js';

  if (!options['hack']) {
    await ns.write(hack, `
      /** @param {NS} ns **/
      export async function main(ns) {
          await ns.hack(ns.args[0]);
      }
    `, 'w');
  }
  if (!options['grow']) {
    await ns.write(grow, `
      /** @param {NS} ns **/
      export async function main(ns) {
          await ns.grow(ns.args[0]);
      }
    `, 'w');
  }
  if (!options['weaken']) {
    await ns.write(weaken, `
      /** @param {NS} ns **/
      export async function main(ns) {
          await ns.weaken(ns.args[0]);
      }
    `, 'w');
  }

  // Divs variables declarations
  var serverList = ns.scan('home'),
    serverCount = [serverList.length, 0],
    softwares = [0, 0, 0, 0, 0, 0],
    softwaresCount = 0,
    scanLevel = 2,
    index = 0,
    notProxyList = [],
    proxyList = [],
    hackables = [],
    growables = [],
    weakenables = [],
    linked,
    target,
    proxyTarget,
    depth = 0,
    checked = 0,
    hackType;

  // Checking softwares
  softwaresCount = await getPortUnlockable(ns);
  serverList = await getServerUntilPort(ns, softwaresCount) ;
  /*
  ns.print('/---/ SEARCHING \\---\\\n-- Default --\n > ' + serverList.join('\n > ') + '\n>- Scan Limit: L' + [scanLevel + 1] + ' -<');
  while (index <= serverCount[depth] - 1 && depth < scanLevel) {
    linked = ns.scan(serverList[checked]);
    checked++;
    for (let index = 0; index <= linked.length - 1; index++) { target = linked[index]; if (target != 'home' && !serverList.includes(target)) { serverList.push(target); ns.print('L' + [depth + 2] + ' > ' + target);
        serverCount[depth + 1]++;
      }
    }
    if (index == serverCount[depth] - 1) {
      index = 0;
      depth++;
      serverCount.push(0);
    } else {
      index++;
    };
  }//*/

  ns.print('/-------/ CHECKING \\-------\\');
  for (let index = 0; index <= serverList.length - 1; index++) { 
    target = serverList[index]; 
    if (options['kill']) { await terminateServer(ns, softwaresCount, [hack, grow, weaken]); } 
    else { ns.scp([hack, grow, weaken], 'home', target); }
    await ns.sleep(50);
    if (ns.getServerMaxRam(target) < 1.7) { ns.print(' >X<  NO RAM ' + target);
    } else if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target)) { 
      ns.print(' >X< SKILL ' + target); 
      proxyList.push(target);
    } else { 
      await secureServ(ns, target);
      if (ns.getServerMaxMoney(target) == 0) { ns.print(' >X< NO MONEY ' + target); proxyList.push(target); 
      ns.print(' >>>  PROXY ' + target);
      } else {
        notProxyList.push(target);
        ns.print(' >>>  VALID ' + target);
      }
    }
  }

  if (notProxyList.length > 0) {
    ns.print('/------------/ HACKING \\------------\\');
    while (true) {
      softwaresCount = await getPortUnlockable(ns);
      serverList = await getServerUntilPort(ns, softwaresCount);
      hackables = [];
      growables = [];
      weakenables = [];
      for (target of notProxyList) {
        // Priority for targets: weaken, then grow, then hack
        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
          hackType = weaken;
          weakenables.push(target);
        } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.80) { 
          hackType = grow; growables.push(target); } else { hackType = hack; hackables.push(target); 
        } 
        if ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) > ns.getScriptRam(hackType)) {
          ns.exec(hackType, target, await threadCalc(ns, ns.getServerMaxRam(target) - ns.getServerUsedRam(target), hackType), target);
          ns.print('|||||||||| ' + hackType + ' --> ' + target + ' ||||||||||');
        }
      }
      for (target of serverList) {
        // Priority for proxies: hack, then grow, then weaken
        if (hackables.length > 0) {
          proxyTarget = hackables[Math.floor(Math.random() * hackables.length)];
          hackType = hack;
        } else if (growables.length > 0) {
          proxyTarget = growables[Math.floor(Math.random() * growables.length)];
          hackType = grow;
        } else if (weakenables.length > 0) {
          proxyTarget = weakenables[Math.floor(Math.random() * weakenables.length)];
          hackType = weaken;
        }
        if ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) > ns.getScriptRam(hackType)) {
          ns.exec(hackType, target, await threadCalc(ns, ns.getServerMaxRam(target) - ns.getServerUsedRam(target), hackType), proxyTarget);
          ns.print('|||||||||| proxy --> ' + target + ' --> ' + hackType + ' --> ' + proxyTarget + ' ||||||||||');
        }
      }
      // Await n ms between each servers to avoid issue with the infinite loop
      await ns.sleep(options['waitTime']);
    }
  } else {
    ns.print('Error, no server available.');
  }
}


async function terminateServer(ns, port, files) {
    var mesServs = await getServerUntilPort(ns, port);
    for (var i of mesServs) {
        if (!(ns.hasRootAccess(i))) {
            await testPort(ns, i);
            ns.nuke(i);
        }
        ns.killall(i);
        if (files.filter(el => ns.fileExists(el, i)).length === 0) {
            await ns.sleep(50);
            ns.scp(files, i);
        }
    }
    return true;
}