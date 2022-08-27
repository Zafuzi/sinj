import "rplc8";
import "./styles/app.css";
import {listen, Nodes} from "./lib/helpers";
import {APP_VERSION} from "./VERSION";

console.log(APP_VERSION);
document.title = `Hello world - ${APP_VERSION}`;

let header = rplc8("#r8_header");
header.update({APP_VERSION});

listen("#reloadPage", "click", function(event)
{
	window.location.reload();
});

listen("#callAPI-ping", "click", function(event)
{
	Nodes.call({prefix: "ping", action: "pong"}, function(response)
	{
		if(response.data?.message)
		{
			alert(response.data.message);
		}
	});
})