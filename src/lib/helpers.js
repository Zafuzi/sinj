export const okay = function(response)
{
	console.log(`${response.status} | ${response.message}`, response.data);
};

export const fail = function(response)
{
	console.error(`${response.status} | ${response.message}`, response.error, response.data);
};

export const Nodes = {
	call(data, _okay, _fail)
	{
		if(!(_okay instanceof Function))
		{
			_okay = console.log;
		}
		
		if(!(_fail instanceof Function))
		{
			_fail = console.error;
		}
		
		const MISSING_RESPONSE = {error: "missing api response"};
		const CALL_FAILED = {error: "api call failed"};
		
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/');
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(data));

		xhr.onload = function()
		{
			if(xhr.status !== 200)
			{ 
				console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
				_fail(JSON.parse(xhr?.response || MISSING_RESPONSE));
			}
			else
			{
				_okay(JSON.parse(xhr?.responseText || MISSING_RESPONSE));
			}
		};

		xhr.onprogress = function(event)
		{
			// NOP
		};

		xhr.onerror = function()
		{
			// NOP
			_fail(CALL_FAILED);
		};
	}
};

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
};
