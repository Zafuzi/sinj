/*
    dependencies
        - fs
        - sleepless
        - connect
        - rpc
        - serve-static
        - handlebars
        - cors
*/

delete require.cache[module.filename];	// always reload

/* REQUIRES */
const path = require("path");
const rpc = require("rpc");
const serve = require("serve-static");

const HERE  = path.dirname(module.filename);
let app = require( "rpc" )( "/api/", HERE + "/api/", { cors: true, dev: true } );
app.use(require("serve-static")(HERE + "/static"));
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

module.exports = app;
