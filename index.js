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
const path = require("path");
const rpc = require("rpc");
const serve = require("serve-static");
const fs = require("fs");
const sleepless = require("sleepless");
const url = require("whatwg-url");

const HERE  = path.dirname(module.filename);
let app = require( "rpc" )( "/api/", HERE + "/api/", { cors: true, dev: true } );

const L = sleepless.log5.mkLog("--- Micro\t\t")(5);

app.use((req, res, next) =>
{
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	res.setHeader("Content-Security-Policy", "default-src 'self'");
	res.setHeader("X-Content-Security-Policy", "default-src 'self'");
	res.setHeader("X-WebKit-CSP", "default-src 'self'");
	next();
});

app.use(async function(req, res, next)
{
	const applyLayout = async function(routePath)
	{
		fs.readFile(path.resolve(HERE + "/src/index.html"), function(error, layoutFile)
		{
			if(error)
			{
				L.E(error);
				next();
				return false;
			}
			
			if(!layoutFile)
			{
				L.E(error);
				next();
				return false;
			}
			
			fs.readFile(path.resolve(HERE + "/src/views/" + routePath), function(templateError, templateFile)
			{
				if(templateError)
				{
					L.E(templateError);
					next();
					return false;
				}
				
				if(!templateFile)
				{
					L.E("missing templateFile");
					next();
					return false;
				}
				
				let html = layoutFile?.toString().replace("__yield__", templateFile.toString());
				if(html)
				{
					// inject html
					res.write(html);
					res.end();
					return true;
				}
				else
				{
					next();
					return false;
				}
			});
		});
	}

	const parsedURL = url.parseURL(req.url, {
		baseURL: req.url
	});

	const route = parsedURL.path[0];

	const searchParams = new URLSearchParams(parsedURL.query);
	//console.log(parsedURL.path, req.url)
	
	if(route === "")
	{
		await applyLayout("home/home.html");
		return true;
	}
	
	if(route === "about")
	{
		await applyLayout("about/about.html");
		return true;
	}
	
	if(route === "nested")
	{
		await applyLayout("nested/nested_page/nested_page.html");
		return true;
	}
	
	next();
	return false;
});


if(process.argv.indexOf("localdev") !== -1)
{
	app.use(require("serve-static")(HERE + "/src"));
	const PORT = 12345;
	const server = app.listen(PORT, function()
	{
		console.log(`App listening at: http://localhost:${server.address().port}`);
	});
}
else
{
	app.use(require("serve-static")(HERE + "/dist"));
}

module.exports = app;