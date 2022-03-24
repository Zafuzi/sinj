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
const handlebars 		= require("handlebars");
const cors				= require("cors");

const HERE  = path.dirname(module.filename);
let app = require( "rpc" )( "/api/", HERE + "/api/", { cors: true, dev: true } );

app.use(function(request, response, next)
{
	const layoutTemplate = handlebars.compile(fs.readFileSync(HERE + "/static/layout.handlebars").toString());

	let {method, url, headers} = request;

	console.log(new Date(), method, url);

	if(url === "/")
	{
		url = "home";
	}

	let context =
	{
		url,
		method,
		active: function(route)
		{
			return route.toLowerCase() === url.toLowerCase() ? "active" : "";
		}
	}

	let html = "";

	try {
		let routeDir = HERE + "/static/" + url + "/";
		if(fs.existsSync(routeDir))
		{
			let routeTemplate = null;
			let routeHtml = "";

			if(fs.existsSync(routeDir + url + ".handlebars"))
			{
				routeTemplate = fs.readFileSync(routeDir + url + ".handlebars").toString();

				/*
				if(fs.existsSync(routeDir + url + ".context.js"))
				{
					//console.log(routeDir + url + ".context.js");
					let clientContext = require(routeDir + url + ".context.js");
					for (let key in clientContext) {
						if(!context.hasOwnProperty(key)){
							context[key] = clientContext[key];
						}
					}
				}
			 */
			}

			if(fs.existsSync(routeDir + url + ".html"))
			{
				routeHtml = fs.readFileSync(routeDir + url + ".html").toString();
			}

			//console.log(routeTemplate)
			//console.log(context);

			context.content = routeTemplate || routeHtml;

			html = layoutTemplate(context);
			// compile handlebars for dir and send
			response.end(html);
			return;
		}
		else
		{
			if(!fs.existsSync(HERE + "/static/" + url))
			{
				// load 404?
				console.log("404")
				let routeTemplate = handlebars.compile(fs.readFileSync(HERE + "/static/404.handlebars").toString());
					context.content = routeTemplate(context);

				html = layoutTemplate(context);
				// compile handlebars for dir and send
				response.end(html);
			}
		}
	}
	catch(error)
	{
		console.error(error);
		html = layoutTemplate(context);
		response.end(html);
		return;
	}

	next();
});

app.use(require("serve-static")(HERE + "/static"));

module.exports = app;