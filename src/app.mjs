import {APP_VERSION, listen, Micro} from "./lib/lib.js";
console.log(document.title);

listen("#reloadPage", "click", function(event)
{
	window.location.reload();
});

listen("#callAPI-ping", "click", function(event)
{
	Micro.call({action: "ping"}, function(error, response)
	{
        if(error)
        {
            console.error(error);
            return;
        }
        
        alert("Message from ping: " + response.data?.message);
	});
})

window.addEventListener("load", function()
{
	const parsedURL = new URL(window.location);
	const route = parsedURL.pathname.split("/")[1];

	document.title = `Micro | ${APP_VERSION}`
	document.querySelector(`[href="/${route}"]`)?.classList.add("active");

	let stylesheets = document.querySelectorAll("link[rel='preload']");
	stylesheets.forEach(function(stylesheet)
	{
		stylesheet.setAttribute("rel", "stylesheet");
	});
});