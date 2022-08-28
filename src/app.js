import {listen, Micro} from "./lib/lib.js";
console.log(document.title);

listen("#reloadPage", "click", function(event)
{
	window.location.reload();
});

listen("#callAPI-ping", "click", function(event)
{
	Micro.call({action: "ping"}, function(response)
	{
		console.log(response);
		if(response.data?.message)
		{
			alert(response.data.message);
		}
	});
})

window.addEventListener("load", function()
{
	document.querySelector("#loadingIndicator").remove();
	document.querySelector("#mainContent").classList.remove("transparent");
	
	let link = window.location.href.split("/").pop();
	document.querySelector(`[href="/${link}"]`).classList.add("active");
});