let posts = rplc8(QS1("#r8_posts"));

setTimeout(function()
{
	posts.update([
		{id: 0, url: ""},
		{id: 1, url: ""},
	]);
}, 1000 * 5);

rpc("/api",
	{
		cmd: "getPosts"
	}, function()
	{

	}, function()
	{

	});