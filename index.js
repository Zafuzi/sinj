delete require.cache[module.filename];	// always reload

const path = require("path");
//const rpc = require("rpc");
//const serve = require("serve-static");
const fs = require("fs");
const sleepless = require("sleepless");
const url = require("whatwg-url");
const HERE  = path.dirname(module.filename);
const L = sleepless.log5.mkLog("- ")(3);

if(process.argv.indexOf("-vv") !== -1) L(4);
if(process.argv.indexOf("-vd") !== -1) L(5);

const app = require("connect")();


// simple logger
app.use((req, res, next) =>
{
    L.V( req.method + " " + req.url );
    next();
});


app.use( require( "rpc" )( "/server/", HERE + "/server/", { cors: true, dev: true } ) );

const routes = {
    home: {
        view: "home.html"
    },
    about: {
        view: "about.html"
    },
    login: {
        view: "login.html"
    }
}

// Some of these should maybe be upstream of the rpc middleware XXX
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
		fs.readFile(path.resolve(HERE + "/client/index.html"), function(error, layoutFile)
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
			
			fs.readFile(path.resolve(HERE + "/client/views/" + routePath), function(templateError, templateFile)
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

	let route = parsedURL.path[0];
	if(route === "")
	{
		route = "home";
	}

	const searchParams = new URLSearchParams(parsedURL.query);
	//console.log(parsedURL.path, req.url)
	
	if(routes[route])
	{
		L.D(routes[route]);
		await applyLayout(routes[route].view);
		return true;
	}
	
	next();
	return false;
});


if(process.argv.indexOf("localdev") !== -1)
{
	app.use(require("serve-static")(HERE + "/client"));
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
