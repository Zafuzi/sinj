delete require.cache[module.filename];	// always reload

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "production";

const isDev = ENV === "development";

const path = require("path");
const express = require("express");

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

app.use(express.static(path.resolve(__dirname, "build")));

app.post("*", bodyParser, (req, res) =>
{
    const methods = require(path.resolve(__dirname, "server", "methods"));
    const body = req.body;
    const action = body?.action;

    L.V(`C >>>> S | method: ${req.method} | action: ${action}`);

    const _okay = function( data ) {
        return res.json({error: null, result: data});
    }

    const _fail = function( error ) {
        return res.json({error, result: null});
    }

    if(!action)
    {
        _fail("No action specified");
    }

    if(!methods[action])
    {
        return _fail(`Method not found: ${  action}`);
    }

    methods[action](req.body, _okay, _fail);
});

app.get("*", (req, res) =>
{
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
});


if(isDev)
{
    app.listen(PORT, () =>
    {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}

module.exports = app;
