import "rplc8";
import "./styles/app.css";
import {listen} from "./lib/helpers";

const APP_VERSION = "0.0.2 - Bouncing Bagan";

console.log(APP_VERSION);
document.title = `Hello world - ${APP_VERSION}`;

let header = rplc8("#r8_header");
header.update({APP_VERSION});

listen("#reloadPage", "click", function(event)
{
	window.location.reload();
});