delete require.cache[module.filename];	// always reload
const fs    = require("fs");
const path  = require("path");
const HERE  = path.dirname(module.filename);
const version = require("./version.js");

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

const router = function(request, response, next)
{
    let {_parsedUrl} = request;
    let requestedRoute = _parsedUrl.pathname.split("/");
        requestedRoute = requestedRoute[requestedRoute.length - 1];

    //console.log(_parsedUrl, requestedRoute)

    let route = routes[requestedRoute];

    // console.log(route);

    let stylesheetString = "";
    let contentString = "";
    let scriptsString = "";
    let versionString = version;
    let titleString = (route && route.title) || "Nodes - " + requestedRoute;

    if(route && route.content && route.stylesheets && route.scripts)
    {
        try
        {
            contentString = fs.readFileSync(HERE + "/static/" + route.content).toString();
            if(contentString)
            {
                // rplc8
                //console.log(contentTemplate);
            }
        }
        catch(error)
        {
            console.error("FAILED to read file: %s/static/%s", HERE, route.content);
        }

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
    layoutTemplate = layoutTemplate.replace(/{{content}}/gm, contentString);
    layoutTemplate = layoutTemplate.replace(/{{scripts}}/gm, scriptsString);
    layoutTemplate = layoutTemplate.replace(/{{title}}/gm, titleString);
    layoutTemplate = layoutTemplate.replace(/{{version}}/gm, versionString);
    if(route && route.title)
    {
        layoutTemplate = layoutTemplate.replace(/{{active (.*)}}/gm, function(a, b)
        {
            console.log(a, b, route.title);
            return route.title.toLowerCase() === b.toLowerCase() ? "active" : "";
        });
    }

    //console.log(layoutTemplate)

    if(route)
    {
        response.end(layoutTemplate);
    }
    else
    {
        next();
    }
}

module.exports = {routes, router};