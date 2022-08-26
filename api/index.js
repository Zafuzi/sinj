delete require.cache[module.filename];	// always reload

const path = require("path");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("--- api\t\t")(3);

const DS = require("ds").DS;
const configPath = path.resolve(__dirname, ".api.config.json");
const datastore = new DS(configPath);

const run = function(prefix, _input, _datastore, _okay, _fail)
{
	const Module = require("./rpc_" + prefix + ".js");
	const prefixModule = new Module(_input, _datastore, _okay, _fail);

	L.V(` prefix: ${prefix} | action: ${_input.action}`);

	if(prefixModule[_input.action] instanceof Function)
	{
		prefixModule[_input.action]();
		return true;
	}

	_fail({message: "Method not found", action: _input.action});
	return false;
};

module.exports = async function(input, _okay, _fail)
{
	const {prefix, action} = input;
	
	console.log(prefix, action);
	
	const okay = function(data)
	{
		_okay({ status: 200, data });
	}
	
	const fail = function(data, statusCode)
	{
		L.E(sleepless.o2j(data) + " prefix: " + prefix);
		_fail({ status: statusCode || 400, data });
	}

	if(!action)
	{
		fail({message: "Action not provided"});
		return false;
	}
	
	if(prefix)
	{
		run(prefix, input, datastore, okay, fail);
		return true;
	}

	L.E("--- Action does not exist: " + action);
	fail({message: "Action does not exist", action}, 501);
	return false;
};