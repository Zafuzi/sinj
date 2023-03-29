const APP_VERSION = "0.1.0 - Marcher Trinket";

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

listen("window", "load", function()
{
	const parsedURL = new URL(window.location);
	const route = parsedURL.pathname.split("/")[1];

	document.title = `KetoJS | ${APP_VERSION}`
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
        
        // inject sid if available
        const sid = Session.get("sid");
        if(sid)
        {
            params.sid = sid;
        }
        
        sleepless.rpc("/server/", params, okay, fail);
    }
}

const Session = {
    data: {},
    get(key, loadFromLocalStorage)
    {
        if(!key)
        {
            return null;
        }
        
        let val = null;
        
        if(loadFromLocalStorage)
        {
            val = localStorage.getItem(key);
            Session.set(key, val);
        }
        
        return Session.data[key] || val; 
    },
    set(key, value, saveToLocalStorage)
    {
        if(!key || !value)
        {
            return false;
        }

        Session.data[key] = value;

        if(saveToLocalStorage)
        {
            localStorage.setItem(key, value);
        }
    },
    unset(key, removeFromLocalStorage)
    {
        if(!key)
        {
            return false;
        }

        delete Session.data[key];

        if(removeFromLocalStorage)
        {
            localStorage.removeItem(key);
        }
    },
    all()
    {
        return Session.data;
    },
    clear(clearLocalStorage)
    {
        Session.data = {};

        if(clearLocalStorage)
        {
            localStorage.clear();
        }
    }
}

document.addEventListener("DOMContentLoaded", function()
{
    // load up localstorage into Session
    for(let i = 0; i < localStorage.length; i++)
    {
        let key = localStorage.key(i);
        Session.set(key, localStorage.getItem(key));
    }
    
    // set up login / logout links in the header based on SID in localstorage
    const logoutLink = sleepless.rplc8("#logoutLink");
    const loginLink = sleepless.rplc8("#loginLink");

    if(Session.get("sid"))
    {
        logoutLink.update({});
        loginLink.clear();
    }
    else
    {
        loginLink.update({});
        logoutLink.clear();
    }
});
