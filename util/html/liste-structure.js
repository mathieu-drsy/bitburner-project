//rename file to liste to implement
//add any webm, mp4, mp3, jpg, gif, png or youtube link to the list and use second term to shape the width
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
export function getType(type, includeMP3 = false) {
    const getRandomItem = list => {
        const filteredList = includeMP3 ? list.filter(item => item.endsWith('.mp3')) : list;
        return filteredList[Math.floor(Math.random() * filteredList.length)];
    };

    switch (type) {
        case "success":
            return getRandomItem(success);
        case "wait":
            return getRandomItem(wait);
        case "fail":
            return getRandomItem(fail);
        case "test":
            return getRandomItem(test);
        default:
            return null;
    }
}