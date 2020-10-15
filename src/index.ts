import * as a1lib from "@alt1/base";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

//loads all images as raw pixel data async, images have to be saved as *.data.png
//this also takes care of srgb header bullshit
//this is async to cant acccess them instantly but generally takes <20ms
var imgs = a1lib.ImageDetect.webpackImages({
	homeport: require("./homebutton.data.png")
});

//only works once for some reason... whatever you get the idea
a1lib.PasteInput.listen(ref => {
	var pos = ref.findSubimage(imgs.homeport);
	document.write("find result: " + JSON.stringify(pos));
});

//You can reach exports on window.TEST because of
//config.makeUmd("testpackage", "TEST"); in webpack.config.ts
export function capture() {
	var img = a1lib.captureHoldFullRs();
	var loc = img.findSubimage(imgs.homeport);
	document.write("homeport matches: " + JSON.stringify(loc));

	if (loc.length != 0) {
		alt1.overLayRect(a1lib.mixColor(255, 255, 255), loc[0].x, loc[0].y, imgs.homeport.width, imgs.homeport.height, 2000, 3);
	} else {
		alt1.overLayTextEx("Couldn't find homeport button", a1lib.mixColor(255, 255, 255), 20, Math.round(alt1.rsWidth / 2), 200, 2000, "", true, true);
	}
	//get raw pixels of image and show on screen (used mostly for debug)
	var buf = img.toData(100, 100, 200, 200);
	buf.show();
}

//print text world
//also the worst possible example of how to use global exposed exports as described in webpack.config.json
document.write(`
	<div>paste an image of rs with homeport button (or not)<div>
	<div onclick='TEST.capture()'>Click to capture if on alt1</div>`
);

if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running insane the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
}