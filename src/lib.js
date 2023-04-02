import {Router} from "preact-router";
import { signal } from "@preact/signals";

export const Server = {
    async get(url)
    {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        return response.json();
    },
    async post(action, data)
    {
        data = data || {};
        data.action = action;
        data.sid = sid.value; 

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
}

export const LOCAL_STORAGE_KEY = "ketojs_";
const sidFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY + "sid");

export const sid = signal(JSON.parse(sidFromLocalStorage));
export const isLoggedIn = () => {
    return !!sid.value;
}

export const logout = async () => {
    sid.value = null;
    localStorage.clear();
    console.log("Logging out");
    // Router.route("/login");
}
