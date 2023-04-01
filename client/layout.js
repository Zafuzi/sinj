console.log("layout.js loaded");

// select nav - anchors
const navAnchors = document.querySelectorAll("nav a");

for(let anchor of navAnchors)
{
    anchor.addEventListener("click", (event) =>
    {
        navAnchors.forEach(anchor => anchor.classList.remove("active"));
        event.target.classList.add("active");
    });
}

Server = {
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
        data.action = action;
        
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