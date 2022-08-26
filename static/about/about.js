console.log("here");

listen("#callPing", "click", function()
{
	Nodes.call({prefix: "ping", action: "ping"}, function(response)
	{
		alert(sleepless.o2j(response));
	}, function(failResponse)
	{
		alert(sleepless.o2j(failResponse));
	});
});

listen("#callPong", "click", function()
{
	Nodes.call({prefix: "ping", action: "pong"}, function(response)
	{
		alert(sleepless.o2j(response));
	}, function(failResponse)
	{
		alert(sleepless.o2j(failResponse));
	});
});
