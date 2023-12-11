const success = [
	["https://cdn.discordapp.com/attachments/724408703687721025/1041380541645205605/yeah_Bounce.webm"],

];


const wait = [
	["https://cdn.discordapp.com/attachments/724408703687721025/1080497937781633116/HeScrem.mp4"],
	
];

const fail = [
	["https://pbs.twimg.com/media/ETkK-SRXsAAEOHf.jpg", "45%"],
	
];

const test =[
	
	
];
/** @param {NS} ns */
export function getType(type) {
	switch(type){
		case "success": 
			return success[Math.floor(Math.random() * success.length)];
		case "wait":
			return wait[Math.floor(Math.random() * wait.length)];
		case "fail":
			return fail[Math.floor(Math.random() * fail.length)];
		case "test":
			return test[Math.floor(Math.random() * test.length)];
		default:
			return null;
	}
	
}