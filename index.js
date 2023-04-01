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

const logLevel = process.env.LOG_LEVEL || 3;
const L = require("sleepless").log5.mkLog("KetoJS ")(logLevel);

const jsonFile = require("jsonfile");
// const config = jsonFile.readFileSync(path.resolve(__dirname, "settings.json"));

// if(config?.logLevel)
{
    // L(config.logLevel);
// }

const app = express();

// simple logger
app.use((req, res, next) =>
{
    L.D(`C >>>> S | method: ${req.method} url: ${req.url}`);
    next();
});

app.use(express.static(path.resolve(__dirname, clientPrefix)));
app.use(express.static(path.resolve(__dirname, publicPrefix)));
app.set("views", path.resolve(__dirname, clientPrefix));
app.set("view engine", "ejs");

app.get("*", async(req, res) =>
{
    const url = req.originalUrl;

    // get route with path
    const route = routes.find(route => route.path === url);
    
    let routeData = {name: url};
    
    if(route?.onBeforeAction)
    {
        routeData = await route?.onBeforeAction() || {};
    }

    
    res.render("layout", {
        url,
        route: route ? route : {view: "pages/404.ejs"},
        ...routeData
    });
});

app.post("*", (req, res) =>
{
    const methods = require(path.resolve(serverPrefix, "/methods"));
    const url = req.originalUrl;
    const {action} = req.body;
    
    const _okay = function( data ) {
        return res.json({error: null, result: data});
    }
    
    const _fail = function( error ) {
        return res.json({error: error, result: null});
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