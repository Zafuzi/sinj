let nav = null;
let args = sleepless.getQueryData();
	args.route = "/" + window.location.pathname.split("/")[1];

let TEST = false;

document.addEventListener("DOMContentLoaded", function()
{
	nav = document.querySelector("nav");
	setActiveNav();
});

function setActiveNav()
{
	if(nav)
	{
		let activeLink = nav.querySelector(`a[data-route="${args.route}"]`)
		if(activeLink)
		{
			activeLink.classList.add("active");
		}
	}
	console.log("Query Args: %o", args);
}
