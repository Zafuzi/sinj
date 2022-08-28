const path = require("path");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("--- api\t\t")(5);

const DS = require("ds").DS;
const configPath = path.resolve(__dirname, ".api.config.json");
const datastore = new DS(configPath);

const STATUS_CODES = {
	OKAY: 0,
	USER_ERROR: 1,
	SERVER_ERROR: 2,
}

// get all the methods we want to be able to call here
imported_modules = { ...require("./rpc_ping"), ...require("./rpc_foo" ) }

module.exports = async function(input, _okay, _fail)
{
	delete require.cache[module.filename];	// always reload
	
	const {action} = input;

	const okay = function(message, data)
	{
		let blob = { message, data, action, input }
		L.V(sleepless.o2j(blob));
		
		_okay({ status: STATUS_CODES.OKAY, message, ...data });
	}

	const fail = function(message, data, status)
	{
		let blob = { status: status || STATUS_CODES.USER_ERROR, message, data, action, input }
		L.E(sleepless.o2j(blob));
		
		_fail({ status: status || STATUS_CODES.USER_ERROR, message, ...data });
	}

	if(!action)
	{
		fail("Action not provided", {input});
		return false;
	}

	// try catch makes it simple to detect missing actions
	try {
		imported_modules[action](input, okay, fail);
		return true;
	}
	catch(e)
	{
		fail("failed to execute action", { error: e, action, input });
		return false;
	}
};
