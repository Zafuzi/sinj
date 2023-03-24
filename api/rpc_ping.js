delete require.cache[module.filename];

module.exports = {
	ping(input, okay)
	{
		okay("pong");
	}
}