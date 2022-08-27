export const okay = function(response)
{
	console.log(`${response.status} | ${response.message}`, response.data);
}

export const fail = function(response)
{
	console.error(`${response.status} | ${response.message}`, response.error, response.data);
}

export const Nodes = {
	call(data, _okay, _fail)
	{
	}
}

export const listen = function(selector, eventType, onEventFunction)
{
	if(!selector || !eventType || !onEventFunction || !(onEventFunction instanceof Function))
	{
		console.error("Missing something on listener...");
		return false;
	}

	let elements = document.querySelectorAll(selector);
	if(!elements)
	{
		console.error("Element not found, add listener failed...");
		return false;
	}
	

	if(elements.length > 0)
	{
		for(let i = 0; i < elements.length; i++)
		{
			let e = elements[i];
			e.addEventListener(eventType, onEventFunction);
			
			// console.log("Attached listener to: ", e);
		}
	}
	
	return true;
}
