delete require.cache[module.filename];	// always reload

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "production";

const isProd = ENV === "production";
const isDev = ENV === "development";

const clientPrefix = isProd ? "dist/client" : "client";
const publicPrefix = isProd ? "dist/public" : "public";
const serverPrefix = isProd ? "dist/server" : "server";

const express = require("express");
const path = require("path");
const routes = require("./routes");
const url = require('url');
const expressHandlebars = require("express-handlebars");

const settings = require("./settings");

const L = require("sleepless").log5.mkLog("KetoJS ")(settings?.logLevel || 3);

const app = express();
const bodyParser = require("body-parser").json();

// simple logger
app.use((req, res, next) =>
{
    L.V(`C >>>> S | method: ${req.method} url: ${req.url}`);
    next();
});

app.use(express.static(path.resolve(__dirname, clientPrefix)));
app.use(express.static(path.resolve(__dirname, publicPrefix)));

app.engine("handlebars", expressHandlebars.engine());
app.set("views", path.resolve(__dirname, clientPrefix));
app.set("view engine", "handlebars");

app.get("*", async(req, res) =>
{
    const baseRoute = req.url.split("?")[0];
    const route = routes.find(r => r.path === baseRoute);
    const queryData = new URLSearchParams(url.parse(req.url).query);
    const renderData = {
        layout: "layout",
        helpers: require(path.resolve(clientPrefix, "helpers")),
        baseRoute
    };
    
    if(!route)
    {
        return res.render("pages/404", renderData);
    }
    
    if(route.layout)
    {
        renderData.layout = route.layout;
    }
    
    if(route.onBeforeAction instanceof Function)
    {
        renderData.data = await route.onBeforeAction(queryData);
    }
    
    renderData.route = {
        path: route.path,
        name: route.name
    }
    
    res.render(route.view, renderData);
});

app.post("*", bodyParser, (req, res) =>
{
    const methods = require(path.resolve(serverPrefix, "methods"));
    const body = req.body;
    const action = body?.action;
    
    L.V(`C >>>> S | method: ${req.method} | action: ${action}`);
    
    const _okay = function( data ) {
        return res.json({error: null, result: data});
    }
    
    const _fail = function( error ) {
        return res.json({error: error, result: null});
    }
    
    if(!action)
    {
        _fail("No action specified");
    }

    if(!methods[action])
    {
        return _fail("Method not found: " + action);
    }
    
    methods[action](req.body, _okay, _fail);
});

if(isDev)
{
    app.listen(PORT, () =>
    {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}

module.exports = app;