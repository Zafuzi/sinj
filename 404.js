delete require.cache[module.filename];	// always reload

const fs    = require("fs");
const path  = require("path");
const HERE  = path.dirname(module.filename);
const version = require("./version");

module.exports = function(request, response)
{
	let notFoundTemplate = fs.readFileSync(HERE + "/static/404.html").toString();

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
}