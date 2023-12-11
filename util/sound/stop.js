/** @param {NS} ns */
export async function main(ns) {
	const audio = getCurrentlyPlayingAudio();
	ns.print(audio);
	audio.forEach(el => el.pause());
}

function getCurrentlyPlayingAudio() {
	var result =[];
	const check = Audio.allInstance;
	if(check!==null){
		check.forEach(el => {
			if(!el.paused){
				result.push(el);
			}
			Audio.allInstance.slice(Audio.allInstance.findIndex(a => a===el),1);
		});
	}
	return result;
}