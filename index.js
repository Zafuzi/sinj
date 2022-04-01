/*
    dependencies
        - fs
        - sleepless
        - connect
        - rpc
        - serve-static
        - handlebars
        - cors
*/

delete require.cache[module.filename];	// always reload

/* REQUIRES */
const path              = require("path");
const connect           = require("connect");
const rpc               = require("rpc");
const serve             = require("serve-static");
const fs                = require("fs");
const sleepless         = require("sleepless");
const cors				= require("cors");

const HERE  = path.dirname(module.filename);
let app = require( "rpc" )( "/api/", HERE + "/api/", { cors: true, dev: true } );

let version = "0.0.2 - Calamity"

app.use(require("serve-static")(HERE + "/static"));
app.use(function(request, response, next)
{
	const layoutTemplate = fs.readFileSync(HERE + "/static/layout.html").toString();

	let {method, url, headers} = request;

	console.log(new Date(), method, url);

	let context = { url, method, version }

	let html = "";

	try {
		let route = path.resolve(url.split("?")[0]).toId();
		if(route === "")
		{
			route = "/home";
		}

		context.route =
			{
				title: route.toId()
			}

		let routeDir = path.resolve(HERE + "/static/" + route);
		let filePath = routeDir + "/" + route + ".html";

		if(fs.existsSync(filePath))
		{
			context.content = fs.readFileSync(filePath).toString();
		}
		else
		{
			context.content = fs.readFileSync(HERE + "/static/404.html").toString();
		}

		response.end(parseLayout(layoutTemplate, context));
	}
	catch(error)
	{
		console.error(error);
		response.end(parseLayout(layoutTemplate, context));
		return;
	}

	next();
});

const parseLayout = function(template, context)
{
	if(!context)
	{
		return "";
	}

	template = template.replace(/__content__/gm, context.content);
	template = template.replace(/__active__/gm, context.route);
	template = template.replace(/__route.title__/gm, context.route ? context.route.title : context.url);
	template = template.replace(/__version__/gm, context.version);

	let components = template.match(/__components\/(.*)__/gm);
	for(let i = 0; i < components.length; i++)
	{
		let p= components[i].replace(/__components\/(.*)__/gm, HERE + "/static/components/$1.html");

		if(fs.existsSync(p))
		{
			console.log(p);
			try
			{
				template = template.replace("" + components[i], fs.readFileSync(p).toString());
			}
			catch(error)
			{
				throw new Error(error);
			}
		}
	}

	return template;
}

module.exports = app;
