

delete require.cache[module.filename];

const path = require("path");
const sleepless = require("sleepless");
const Module = require("./rpc_module");

const L = sleepless.L.mkLog("--- Ping\t\t")(5);

class PingMethods extends Module
{

	constructor(_input, _datastore, _okay, _fail)
	{
		super(_input, _datastore, _okay, _fail);
	}

	pong()
	{
		this.okay({message: "pong"});
	}
}

module.exports = PingMethods;