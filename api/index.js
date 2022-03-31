delete require.cache[ module.filename ];	// always reload
const HERE = require("path").dirname( module.filename );

const fs = require( "fs" );

require("sleepless");
const L = log5.mkLog( "BLOGS " )( 3 );

module.exports = function(input, _okay, _fail)
{
	let {action} = input;
	console.log(action);

	if(action === "getPosts")
	{
		rpc("https://api.imgflip.com/get_memes", {}, _okay, _fail, true);
		return;
	}

	if(action === "login")
	{
		let {username, password} = input;
		if(!username)
		{
			_fail("username missing.");
			return;
		}
		if(!password)
		{
			_fail("password missing.");
			return;
		}

		if(!check(username, "string"))
		{
			_fail("username is not a string");
			return;
		}

		if(!check(password, "string"))
		{
			_fail("password is not a string");
			return;
		}

		// connect to db and check credentials

		_okay();
		return;
	}

	_fail();
}


function check(obj, type)
{
	return typeof obj === type;
}
