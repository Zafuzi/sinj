// globals can go here
const queryData = sleepless.getQueryData();
const currentRoute = "/" + window.location.pathname.split("/")[1];

let header = document.createElement("header")
const isActiveRoute = function(route)
{
	if(currentRoute === route)
	{
		return "active";
	}

	return "";
}

header.innerHTML = `
	<nav class="flex flow-row align-center gap-16 padding" id="headerNavigation">
		<a class="${isActiveRoute("/")}" href="/">
			<i class="ion-home"></i> Home
		</a>
		<a class="${isActiveRoute("/about")}" href="/about">
			 <i class="ion-help-buoy"></i> About
		</a>
		<a class="${isActiveRoute("/hidden") ? " active" : " hid"}" href="/hidden">Hidden Route</a>
	</nav>
`;

document.body.prepend(header);
