delete require.cache[module.filename];	// always reload

const fs    = require("fs");
const path  = require("path");
const HERE  = path.dirname(module.filename);

const version = require("./version");

const routes = {
    "": { // means default route i.e https://site.com
        // stylesheets, scripts, and content assume they are being served from /static/
        content: "pages/home/home.html",
        stylesheets: ["pages/home/home.css"], 
        scripts: ["pages/home/home.js"],
        title: "Home",
    },
    "about": { 
        content: "pages/about/about.html",
        stylesheets: ["pages/about/about.css"], 
        scripts: ["pages/about/about.js"],
        title: "About",
    }
}

module.exports = function(request, response, next)
{
    let {_parsedUrl} = request;
    let requestedRoute = _parsedUrl.pathname.split("/").pop();

    //console.log(_parsedUrl, requestedRoute)

    let route = routes[requestedRoute];

    // console.log(route);

    let stylesheetString = "";
    let contentString = "";
    let scriptsString = "";
    let titleString = (route && route.title) || "Nodes - " + requestedRoute;

    if(route && route.content && route.stylesheets && route.scripts)
    {
        for(let stylesheet of route.stylesheets)
        {
            stylesheetString += `<link rel="stylesheet" href="${stylesheet}">`;
        }

        for(let script of route.scripts)
        {
            scriptsString += `<script src="${script}"></script>`;
        }
    }

    let layoutTemplate = fs.readFileSync(HERE + "/static/layout.html").toString();

    layoutTemplate = layoutTemplate.replace(/{{stylesheets}}/gm, stylesheetString);
    layoutTemplate = layoutTemplate.replace(/{{scripts}}/gm, scriptsString);
    layoutTemplate = layoutTemplate.replace(/{{title}}/gm, titleString);
    layoutTemplate = layoutTemplate.replace(/{{version}}/gm, version);
    if(route)
    {
        let doAsyn = false;

        layoutTemplate = layoutTemplate.replace(/{{active (.*)}}/gm, function(a, b)
        {
            return route.title.toLowerCase() === b.toLowerCase() ? "active" : "";
        });

        try
        {
            contentString = fs.readFileSync(HERE + "/static/" + route.content).toString();
            layoutTemplate = layoutTemplate.replace(/{{content}}/gm, contentString);
            if(contentString)
            {
                // JOE something like this?
                let routeServerFilePath = path.resolve(`${HERE}/server/${route.title.toLowerCase()}.js`);
                if(fs.existsSync(routeServerFilePath))
                {
                    let mod = require(routeServerFilePath)
                    if(mod.load)
                    {
                        doAsync = true;
                        mod.load(function(context)
                        {
                            layoutTemplate = require("./prepper")(layoutTemplate, context);
                            response.end(layoutTemplate);
                        });
                    }
                    else
                    {
                        layoutTemplate = require("./prepper")(layoutTemplate, mod);
                        response.end(layoutTemplate);
                    }
                }
            }
        }
        catch(error)
        {
            console.error("FAILED to read file: %s/static/%s", HERE, route.content);
            console.error(error);
        }

        if(!doAsync)
        {
            response.end(layoutTemplate);
        }
    }
    else
    {
        next();
    }
}