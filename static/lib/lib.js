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
	console.error(error);
	console.log(data);
	if(callback && typeof callback === "Function")
	{
		callback(error, data);
	}
}

const massage = function(templateName, data)
{
	let template = document.querySelector(`template[name="${templateName}"]`);

	if(!template)
	{
		return;
	}

	let h_template = Handlebars.compile(template.innerHTML);
	let html = h_template(data || {});

	let domNode = document.querySelector(templateName);
	if(!domNode)
	{
		return;
	}

	domNode.outerHTML = html;
}