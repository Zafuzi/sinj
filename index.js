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

let layoutTemplate = fs.readFileSync("/static/layout.html");

const routes = {
    home: {
        content: "/static/pages/home/home.html",
        stylesheets: "/static/pages/home/home.css",
        scripts: "/static/pages/home/home.js",
        before: function(okay, fail)
        {
            okay(data);
        }
    }
}

app.use(function(request, response, next)
{
    let route = request.params;

    route.before(function(data)
    {
        // rplc8(contentTemplate, "#posts", "/posts" data); 
    }, fail);
    //response.send();
    next();
})

console.log(HERE)

app.use(require("serve-static")(HERE + "/static"));

module.exports = app;