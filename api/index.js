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

	_fail();
}
