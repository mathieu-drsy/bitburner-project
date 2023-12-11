/** @param {NS} ns */
function init_Html(ns) {
	resetHtml(ns);
	const element = eval("document").getElementById("terminal");
	if (element != null) {
		element.insertAdjacentHTML('beforeend', `<li id="inpid` + ns.pid + `" 
													class="MuiListItem-root jss928 MuiListItem-gutters MuiListItem-padding css-1578zj2">
												</li>`);
	} else { ns.print("terminal not found."); }
	//ajouter html -> document.getElementById('inpid' + ns.pid).appendChild(div);
	//retirer html -> document.getElementById('inpid' + ns.pid).remove();
}

function resetHtml(ns) {
	const element = eval("document").getElementById("inpid" + ns.pid);
	if (element != null) {
		element.remove();
	}
}

function addPic(ns, link, width = 0) {
	const taille = width != 0 ? "width='" + width + "'" : "";
	const element = eval("document").getElementById("inpid" + ns.pid);
	if (element != null) {
		element.insertAdjacentHTML('beforeend', `<img id="pid` + ns.pid + `_img" 
														src="` + link + `" ` + taille + `
													onload="setTimeout(()=>{document.getElementById('inpid`+  ns.pid + `').remove();}, 5000);">`);
	}
}

//function changePic(ns, link) { document.getElementById("pid" + ns.pid + "_img").src = link; }

function makeVideo(ns, link, width = 0) {
	const taille = width != 0 ? "width='" + width + "'" : "";
	const element = eval("document").getElementById("inpid" + ns.pid);
	if (element != null) {
		ns.print(element);
		element.insertAdjacentHTML('beforeend', `<video ` + taille + ` src="` + link + `" autoplay 
													onended="document.getElementById('inpid`+ ns.pid + `').remove();">
												</video>`);
	}
}

function makeYt(ns, link, width = 0) {
	const taille = width != 0 ? "width='" + width + "'" : "";
	const element = eval("document").getElementById("inpid" + ns.pid);
	if (element != null) {
		element.insertAdjacentHTML('beforeend', `<iframe ` + taille + ` height='auto'
													src="`+ link + "?autoplay=1" + `">
												</iframe>`);
	}
}

//export function show_end(ns) { init_Html(ns); makeYt(ns, 'https://www.youtube.com/embed/gy9w1CfYdEs'); }

import { getType } from "/util/html/liste.js";
import { sound } from "/util/sound/notif.js";
/** 
 * @param {NS} ns 
 * @param {TYPE} type "success" "wait" "fail"
 **/
export function htmlManager(ns, type) {
	const el = getType(type);
	if (el === null) { return; }
	const width = el.length > 1 ? el[1] : 0;
	init_Html(ns);
	switch (el[0].split('.')[el[0].split('.').length - 1]) {
		case "jpg": case "jpeg": case "png:": case "gif":
			addPic(ns, el[0], width);
			break;
		case "webm": case "mp4": case "mov":
			makeVideo(ns, el[0], width);
			break;
		case "mp3": case "ogg": case "m4a": case "wav":
			sound(el[0]);
			break;
		default:
			makeYt(ns, el[0])
			break;
	}
}