import {listen, Micro, Route, Router} from "./lib/lib.js";

const router = new Router([
	new Route('home', 'home/home', true),
	new Route('about', 'about/about'),
	new Route('nested', 'nested/nested_page/nested_page'),
]);

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