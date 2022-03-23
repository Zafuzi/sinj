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

console.log(HERE)

app.use(rpc("/api/", HERE + "/api",
{ 
    cors: true,
    dev: true 
}));

app.use(require("serve-static")(HERE + "/static"));

module.exports = app;