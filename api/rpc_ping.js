delete require.cache[module.filename];

module.exports = {
	ping: function(input, okay, fail)
	{
		okay("ping");
	}
}