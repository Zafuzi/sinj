import "./lib/startup.js";

import {listen, Micro} from "./lib/lib.js";

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