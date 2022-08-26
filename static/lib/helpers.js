const okay = function(response)
{
	console.log(`${response.status} | ${response.message}`, response.data);
}

const fail = function(response)
{
	console.error(`${response.status} | ${response.message}`, response.error, response.data);
}

const Nodes = {
	call(data, _okay, _fail)
	{
		console.log(data);
		sleepless.rpc("/api/", data, _okay || okay, _fail || fail);
	}
}

const listen = function(selector, eventType, onEventFunction)
{
	if(!selector || !eventType || !onEventFunction || !(onEventFunction instanceof Function))
	{
		return false;
	}

	let element = sleepless.QS(selector);
	if(!element)
	{
		return false;
	}

	if(element.length > 1)
	{
		element.forEach(function(e)
		{
			e.addEventListener(eventType, onEventFunction);
		});
	}
	else
	{
		element.forEach(function(e)
		{
			e.addEventListener(eventType, onEventFunction);
		});
	}

	return true;
}
