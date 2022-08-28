export const APP_VERSION = "0.0.7 - Gorgon Gartrudenth";

/*
Copyright 2015-2020 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/

// Replaces instances of "__key__" in string s,
// with the values from corresponding key in data.

let substitute = function(s, data)
{
	for(let key in data)
	{
		let stringRE = new RegExp("__" + key + "__", "g");
		let functionRE = new RegExp("__" + key + " (.*)__", "g");

		let stringMatches = s.match(stringRE);
		//console.log(stringMatches);

		let functionMatches = s.match(functionRE);
		if(functionMatches?.length)
		{
			let keys = functionMatches[0].match(/\s[^_]*/gi);
			let functionName = functionMatches[0].match(/[^_'](\w\S*)/gi);


			let args = [];
			for(let i = 0; i < keys.length; i++)
			{
				args.push(keys[i].replace(/[\s']/gi, ""));
			}


			if(data[functionName] instanceof Function)
			{
				console.log(`Calling: ${functionName} with ${args}`);
				s = s.replace(functionRE, data[functionName](...args));
				return s;
			}
		}

		s = s.replace(stringRE, "" + (data[key]));
	}
	return s;
};

// Injects data values into a single DOM element
let inject = function(e, data)
{

	// Inject into the body of the element
	e.innerHTML = substitute(e.innerHTML, data);

	// Inject into the attributes of the actual tag of the element.
	// Do this slightly differently for IE because IE is stupid.
	// XXX Do I still have to do this? Isn't IE dead yet?
	let attrs = e.attributes;
	if(navigator.appName == "Microsoft Internet Explorer")
	{
		for(let k in attrs)
		{
			let val = e.getAttribute(k);
			if(val)
			{
				if(typeof val === "string")
				{
					if(val.match(/__/))
					{
						val = substitute(val, data);
						e.setAttribute(k, val);
					}
				}
			}
		}
	}
	else
	{
		for(let i = 0; i < attrs.length; i++)
		{
			let attr = attrs[i];
			let val = attr.value;
			if(val)
			{
				if(typeof val === "string")
				{
					if(val.match(/__/))
					{
						attr.value = substitute(val, data);
					}
				}
			}
		}
	}
};

// The main function
export const rplc8 = function(elem, data, cb)
{

	// If elem isn't a DOM element, then it has to be query selector string
	if(!(elem instanceof HTMLElement))
	{
		if(typeof elem !== "string")
		{
			throw new Error("rplc8: invalid selector string");
		}
		let coll = document.querySelectorAll(elem);
		if(coll.length !== 1)
		{
			throw new Error("rplc8: selector doesn't match exactly 1 element");
		}
		elem = coll[0];
	}

	let sib = elem.nextSibling;		// Might be null.
	let mom = elem.parentNode;		// Almost certainly not null.
	let clones = [];

	mom.removeChild(elem);		// Take template out of the DOM.

	let validate_data = function(data)
	{
		// Ensure that data is an array or object
		if(!(data instanceof Array))
		{
			// If it's a single object, put it into an array.
			if(typeof data === "object")
			{
				data = [data];
			}
			else
			{
				data = [];
				//throw new Error( "rplc8: Replication is neither array nor object." );
			}
		}

		// Ensure that the first element in the array is an object.
		if(data.length > 0 && typeof data[0] !== "object")
		{
			throw new Error("rplc8: Replication data array does not contain objects.");
		}

		return data;
	};

	let obj = {};

	let splice = function(index, remove_count, new_data, cb)
	{

		if(index < 0)
		{
			index = clones.length + index;
		}
		if(index > clones.length)
		{
			index = clones.length;
		}

		let sib = clones[index] || null;

		if(index < clones.length)
		{
			// remove the old clones
			let n = 0;
			while(n < remove_count && index < clones.length)
			{
				let clone = clones.splice(index, 1)[0];
				sib = clone.nextSibling;
				mom.removeChild(clone);
				n += 1;
			}
		}

		// insert new clones if data provided
		if(new_data)
		{
			data = validate_data(new_data);
			let n = 0;
			while(n < data.length)
			{
				let d = data[n];						// Get data object from array.
				let clone = elem.cloneNode(true);		// Clone template element and
				inject(clone, d);						// inject the data.
				mom.insertBefore(clone, sib);			// Insert it into the DOM
				let i = index + n;
				clones.splice(i, 0, clone);	// insert clone into array
				if(cb)
				{								// If call back function provided,
					// then call it with a refreshing function
					cb(clone, d, i, function(new_data, cb)
					{
						splice(i, 1, new_data, cb);
					});
				}
				n += 1;
			}
		}

		return obj;
	};

	let append = function(data, cb)
	{
		return splice(clones.length, 0, data, cb);
	};

	let prepend = function(data, cb)
	{
		return splice(0, 0, data, cb);
	};

	let update = function(data, cb)
	{
		return splice(0, clones.length, data, cb);
	};

	let clear = function(index, count)
	{
		return splice(index || 0, count || clones.length);
	};

	update(data, cb);

	obj.splice = splice;
	obj.append = append;
	obj.prepend = prepend;
	obj.update = update;
	obj.clear = clear;

	return obj;

};

export const okay = function(response)
{
	console.log(`${response.status} | ${response.message}`, response.data);
};

export const fail = function(response)
{
	console.error(`${response.status} | ${response.message}`, response.error, response.data);
};

export const Micro = {
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

	// handle single HTMLElement
	if(selector instanceof HTMLElement)
	{
		selector.addEventListener(eventType, onEventFunction);
		return true;
	}

	// Handle multiple HTMLElements in an array
	if(selector instanceof Array)
	{
		selector.forEach(s =>
		{
			if(s instanceof HTMLElement)
			{
				s.addEventListener(eventType, onEventFunction);
			}

			if(s instanceof String)
			{
				let elements = document.querySelectorAll(s);
				if(!elements)
				{
					console.error("Element not found, add listener failed...", s);
					return false;
				}

				if(elements.length > 0)
				{
					for(let i = 0; i < elements.length; i++)
					{
						let e = elements[i];
						e.addEventListener(eventType, onEventFunction);
					}
				}
			}
		});

		return true;
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

export const getQueryData = function()
{
	let o = {};
	let s = document.location.search;
	if(s)
	{
		let kv = s.substring(1).split("&");
		for(let i = 0; i < kv.length; i++)
		{
			let aa = kv[i].split("=");
			o[aa[0]] = decodeURIComponent(aa[1]);
		}
	}
	return o;
};
