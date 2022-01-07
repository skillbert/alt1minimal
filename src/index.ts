//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as a1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");


var output = document.getElementById("output");

//loads all images as raw pixel data async, images have to be saved as *.data.png
//this also takes care of metadata headers in the image that make browser load the image
//with slightly wrong colors
//this function is async, so you cant acccess the images instantly but generally takes <20ms
//use `await imgs.promise` if you want to use the images as soon as they are loaded
var imgs = a1lib.ImageDetect.webpackImages({
	homeport: require("./homebutton.data.png")
});

//listen for pasted (ctrl-v) images, usually used in the browser version of an app
a1lib.PasteInput.listen(img => {
	findHomeport(img);
}, (err, errid) => {
	output.insertAdjacentHTML("beforeend", `<div><b>${errid}</b>  ${err}</div>`);
});

//You can reach exports on window.TEST because of
//config.makeUmd("testpackage", "TEST"); in webpack.config.ts
export function capture() {
	if (!window.alt1) {
		output.insertAdjacentHTML("beforeend", `<div>You need to run this page in alt1 to capture the screen</div>`);
		return;
	}
	if (!alt1.permissionPixel) {
		output.insertAdjacentHTML("beforeend", `<div>Page is not installed as app or capture permission is not enabled</div>`);
		return;
	}
	var img = a1lib.captureHoldFullRs();
	findHomeport(img);
}

function findHomeport(img: ImgRef) {
	var loc = img.findSubimage(imgs.homeport);
	output.insertAdjacentHTML("beforeend", `<div>homeport matches: ${JSON.stringify(loc)}</div>`);

	//overlay the result on screen if running in alt1
	if (window.alt1) {
		if (loc.length != 0) {
			alt1.overLayRect(a1lib.mixColor(255, 255, 255), loc[0].x, loc[0].y, imgs.homeport.width, imgs.homeport.height, 2000, 3);
		} else {
			alt1.overLayTextEx("Couldn't find homeport button", a1lib.mixColor(255, 255, 255), 20, Math.round(alt1.rsWidth / 2), 200, 2000, "", true, true);
		}
	}

	//get raw pixels of image and show on screen (used mostly for debug)
	var buf = img.toData(100, 100, 200, 200);
	buf.show();
}

//print text world
//also the worst possible example of how to use global exposed exports as described in webpack.config.json

output.insertAdjacentHTML("beforeend", `
	<div>paste an image of rs with homeport button (or not)</div>
	<div onclick='TEST.capture()'>Click to capture if on alt1</div>`
);

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running inside the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
}