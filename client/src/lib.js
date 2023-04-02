import {Signal} from "@preact/signals";

export const Server = {
    async get(url)
    {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            return response.json();
        }
        catch(e)
        {
            console.error(e);
            return {error: "Network error"};
        }
    },
    async post(action, data)
    {
        data = data || {};
        data.action = action;
        data.sid = Session.get("sid", true);

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            });

            return response.json();
        }
        catch(e)
        {
            console.error(e);
            return {error: "Network error"};
        }
    }
}

class SignalSession extends Signal {
    LOCAL_STORAGE_KEY = "sinj_";
    
    constructor()
    {
        super();
    }
    set(key, value, persist = false)
    {
        if(persist)
        {
            localStorage.setItem(this.LOCAL_STORAGE_KEY + key, JSON.stringify(value));
        }
        
        this[key] = value;
    }
    get(key, loadFromLocalStorage = false)
    {
        if(loadFromLocalStorage)
        {
            const valueFromLocalStorage = localStorage.getItem(this.LOCAL_STORAGE_KEY + key);
            if(valueFromLocalStorage)
            {
                this[key] = JSON.parse(valueFromLocalStorage);
            }
        }
        
        return this[key];
    }
    unset(key, removeFromLocalStorage = false)
    {
        if(removeFromLocalStorage)
        {
            localStorage.removeItem(this.LOCAL_STORAGE_KEY + key);
        }
        
        delete this[key];
    }
}

export const Session = new SignalSession();

export const isLoggedIn = () => {
    const sid = Session.get("sid", true);
    return !!sid;
}

export const logout = async () => {
    Session.unset("sid", true);
    localStorage.clear();
    
    window.location.href = "/login";
}

export const getUserData = async() => {
    // always get user session if logged in
    const {error, result} = await Server.post("getSession");

    if(error)
    {
        console.error(error);
    }

    if(result)
    {
        // Session.set("user", result);
        return result;
    }
    
    return null;
}
