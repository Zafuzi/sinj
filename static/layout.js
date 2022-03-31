let nav = null;
let args = sleepless.getQueryData();
	args.route = "/" + window.location.pathname.split("/")[1];

let TEST = false;

document.addEventListener("DOMContentLoaded", function()
{
	nav = document.querySelector("nav");
	setActiveNav();

	if(TEST)
	{
		runTests();
	}
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

function runTests()
{
	if(!nav)
	{
		fail("nav element does not exist in page");
	}

	let activeLink = nav.querySelector(`a.active`);
	if(!activeLink)
	{
		fail("active link was not set");
	}
}
