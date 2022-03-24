export const getPosts = function()
{
	sleepless.rpc("/api/", {action: "getPosts"}, function(result)
	{
		massage("memes", {memes:result.data.memes})
	}, fail, true);
}

getPosts();