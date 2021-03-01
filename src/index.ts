import * as a1lib from '@alt1/base';

// Tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

// Loads all images as raw pixel data async, images have to be saved as *.data.png
// This also takes care of srgb header bullshit
// This is async, so can't be accessed instantly, but generally takes <20ms
const imgs = a1lib.ImageDetect.webpackImages({
	homeport: require("./homebutton.data.png")
});

a1lib.PasteInput.listen(ref => {
	const loc = ref.findSubimage(imgs.homeport);
	document.getElementById("result").innerText = "Found result: " + JSON.stringify(loc);
});

// You can reach exports on window.TEST because of
// config.makeUmd("testpackage", "TEST"); in webpack.config.ts
export function capture() {
	const img = a1lib.captureHoldFullRs();
	const loc = img.findSubimage(imgs.homeport);
	document.getElementById("result").innerText = "Found result: " + JSON.stringify(loc);

	if (loc.length != 0) {
		alt1.overLayRect(a1lib.mixColor(255, 255, 255), loc[0].x, loc[0].y, imgs.homeport.width, imgs.homeport.height, 2000, 3);
	} else {
		alt1.overLayTextEx("Couldn't find homeport button", a1lib.mixColor(255, 255, 255), 20, Math.round(alt1.rsWidth / 2), 200, 2000, "", true, true);
	}
	// Get raw pixels of image and show on screen (used mostly for debug)
	const buf = img.toData(loc[0].x - 100, loc[0].y - 100, 200, 200);
	document.getElementById("visual-result").innerHTML = '';
	document.getElementById("visual-result").append(buf.show());
}

a1lib.on('alt1pressed', () => capture());

if (window.alt1) {
	// Tell alt1 about the app (this makes alt1 show the add app button when running inside the embedded browser)
	// Also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
}