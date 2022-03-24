delete require.cache[module.filename];	// always reload

require("sleepless");

let posts = [];

function load(callback)
{
	rpc("https://api.imgflip.com/get_memes", {}, function(result)
	{
		posts = result.data.memes;
		callback({posts});
	}, function(error)
	{
		console.log("failed to fetch posts")
	}, true);
}

module.exports = {load, posts};