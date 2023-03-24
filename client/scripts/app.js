const APP_VERSION = "0.0.7 - Gorgon Gartrudenth";

const listen = function(selector, eventType, onEventFunction)
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

const getQueryData = function()
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

window.addEventListener("load", function()
{
	const parsedURL = new URL(window.location);
	const route = parsedURL.pathname.split("/")[1];

	document.title = `Micro | ${APP_VERSION}`
	document.querySelector(`[href="/${route}"]`)?.classList.add("active");
});

const Server = {
    call(method, params, okay, fail)
    {
        if(!params || params instanceof Function)
        {
            okay = params;
            params = {};
        }

        params.action = method;
        
        if(!okay || !(okay instanceof Function))
        {
            okay = function(response)
            {
                console.log("Server call okay:", response);
            }
        }
        
        if(!fail || !(fail instanceof Function))
        {
            fail = function(error)
            {
                console.error("Server call fail:", error);
            }
        }
        
        sleepless.rpc("/server/", params, okay, fail);
    }
}