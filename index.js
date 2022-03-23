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
const version = require("./version.js");

app.use(require("./flame.js").router);

// console.log(HERE)

app.use(require("serve-static")(HERE + "/static"));

// TODO somehow move this into router.js?
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
    layoutTemplate = layoutTemplate.replace(/{{version}}/gm, version);

    response.end(layoutTemplate);
});

module.exports = app;