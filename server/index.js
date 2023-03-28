delete require.cache[module.filename];	// always reload

const path = require("path");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("\t")(5);

const users = require("sleepless-users");

const { o2j, } = sleepless;

const db = function()
{
    return users.connect("sqlite3", {databaseName: "users.db"});
}

const methods = {
    ping()
    {
        return "pong";
    },
    auth_register(input, okay, fail)
    {
        const {username, email, password} = input;
        L.D(`register: ${username} ${email} ${password}`);
        
        db().register({username, email, password}, (err, user) => {
            if(err) {
                L.E(err.message);
                return fail(err.message);
            }
            
            L.D(`register: ${o2j(user)}`);
            okay(user);
        });
    },
    auth_login(input, okay, fail)
    {
        const {username, password} = input;
        L.D(`login: ${username} ${password}`);
        
        db().login({username, password}, (err, user) => {
            if(err) {
                L.E(err.message);
                return fail(err.message);
            }
            
            L.D(`login: ${o2j(user)}`);
            okay(user);
        });
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
        return methods[action](input, okay, fail);
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
