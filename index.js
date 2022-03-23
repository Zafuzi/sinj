/* 
    dependencies
        - fs
        - sleepless
        - connect
        - rpc
        - serve-static
*/

delete require.cache[module.filename];	// always reload

/* REQUIRES */
const path              = require("path");
const connect           = require("connect");
const rpc               = require("rpc");
const serve             = require("serve-static");
const fs                = require("fs");
const sleepless         = require("sleepless");

const HERE  = path.dirname(module.filename);
const app   = connect();

const routes = {
    "": { // means default route i.e https://site.com
        // stylesheets, scripts, and content assume they are being served from /static/
        content: "pages/home/home.html",
        stylesheets: ["pages/home/home.css"], 
        scripts: ["pages/home/home.js"],
        title: "Home",
        before: function(okay, fail)
        {
        },
        during: function(data)
        {
           //rplc8(contentTemplate, "#posts", "/posts", data);
        },
        after: function(data)
        {
        }
    }
}

app.use(function(request, response, next)
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

    //console.log(layoutTemplate)

    if(route)
    {
        response.end(layoutTemplate);
    }
    else
    {
        next();
    }
})

// console.log(HERE)

app.use(require("serve-static")(HERE + "/static"));

// TODO somehow move this into the above function? 
app.use(function(request, response, next)
{
    let notFoundTemplate = fs.readFileSync(HERE + "/static/notFound.html").toString();

    let stylesheetString = "";
    let contentString = notFoundTemplate;
    let scriptsString = "";
    let titleString = "Nodes - 404 Page not found";


    let layoutTemplate = fs.readFileSync(HERE + "/static/layout.html").toString();

    layoutTemplate = layoutTemplate.replace(/{{stylesheets}}/gm, stylesheetString);
    layoutTemplate = layoutTemplate.replace(/{{content}}/gm, contentString);
    layoutTemplate = layoutTemplate.replace(/{{scripts}}/gm, scriptsString);
    layoutTemplate = layoutTemplate.replace(/{{title}}/gm, titleString);

    response.end(layoutTemplate);
});

module.exports = app;