delete require.cache[module.filename];

module.exports = {
	ping(input, okay, fail)
	{
		okay("ping");
	}
}