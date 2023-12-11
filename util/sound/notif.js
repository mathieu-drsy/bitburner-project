/** @param {NS} ns */
export function notif(text) {
	var msg = new SpeechSynthesisUtterance();
	msg.text = text;
	eval("window").speechSynthesis.speak(msg);
}

export function notifBasic() {
	sound('https://cdn.discordapp.com/attachments/826004465575788585/1087739132337459220/mixkit-gaming-lock-2848.wav');
}


/** @param {string} link */
export function sound(link) {
	const audio = new Audio(link);
	if (Audio.allInstance instanceof Array) { 
		Audio.allInstance.push(audio); 
	} else { 
		Audio.allInstance = [audio];
	}
	audio.play();
}