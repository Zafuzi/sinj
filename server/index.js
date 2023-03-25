delete require.cache[module.filename];	// always reload

const path = require("path");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("--- server\t\t")(5);

const { o2j, } = sleepless;

const methods = {
    ping()
    {
        return "pong";
    },
    throw()
    {
        throw new Error("This is a test error");
    }
}

module.exports = function(input, okay, fail)
{
    L.D( "input: "+o2j(input) );

	const {action} = input;

	if(!action) {
		return fail("Action not provided", {input});
	}

	// try catch makes it simple to detect missing actions
	try {
        okay(methods[action](input));
	}
	catch(e) {
        L.E(e.message);
		fail({ message: e.message, action});
	}
};
