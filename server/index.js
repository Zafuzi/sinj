delete require.cache[module.filename];	// always reload

const path = require("path");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("\t")(5);

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

module.exports = function(input, _okay, _fail)
{
    L.D( "C ---> S "+o2j(input) );

    const okay = function( data ) {
        L.D( "C <=== S "+o2j(input) );
        _okay( data );
    };
    const fail = function( error ) {
        L.D( "C <*** S "+o2j(input) );
        _fail( error );
    };

	const {action} = input;

	if(!action) {
		return fail("Action not provided", {input});
	}

	// try catch makes it simple to detect missing actions
	try {
        okay(methods[action](input));
	}
	catch(e) {
        // This is only going to catch exceptions if every method function (like ping)
        // is fully synchonous, which seems unlikely.
        // The only way for it to work would be force everything in here to use promises, 
        // catch all the exceptions and funnel them through here.
        L.E(e.message);
		fail({ message: e.message, action});
	}
};
