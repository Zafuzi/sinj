const okay = function(data, callback)
{
	console.log(data);
	if(callback && typeof callback === "Function")
	{
		callback(data);
	}
}

const fail = function(error, data, callback)
{
	throw new Error(error);
	if(data)
	{
		console.log(data);
	}
	if(callback && typeof callback === "Function")
	{
		callback(error, data);
	}
}

const massage = function(templateName, data)
{

}
