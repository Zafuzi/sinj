delete require.cache[module.filename];
const sleepless = require("sleepless");

class Module {
	action = "";
	input = {};
	datastore = {};
	okay = console.log;
	fail =  console.error;

	constructor(_input, _datastore, _okay, _fail)
	{
		this.action = _input?.action;
		this.input = _input;
		this.datastore = _datastore;
		this.okay = _okay;
		this.fail = _fail;
	}
}

module.exports = Module;