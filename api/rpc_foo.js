delete require.cache[module.filename];

module.exports = {
	foo(input, okay, fail)
	{
		okay("bar");
	}
}
