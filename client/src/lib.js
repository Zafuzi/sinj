import {Router} from "preact-router";
import { signal } from "@preact/signals";

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
        data.sid = sid.value; 

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

export const LOCAL_STORAGE_KEY = "ketojs_";

export const sid = signal(null);

export const isLoggedIn = () => {
    return !!sid.value;
}

if(typeof window !== "undefined")
{
    const sidFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY + "sid");
    sid.value = sidFromLocalStorage ? JSON.parse(sidFromLocalStorage) : null;
}

export const logout = async () => {
    sid.value = null;
    localStorage.clear();
    console.log("Logging out");
    // Router.route("/login");
}
