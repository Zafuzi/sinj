# nodes-micro-website

This is a simple template to make development of semi-static websites easier. Hosting this site requires the use of a proprietary tool called `nodes`. But anyone can write a simple Express server that simply reroutes to this application. For this template I have used `webserver` to host the site for development ONLY.

## how to edit
- clone this repo
- edit `/static` files for public facing content
- edit `/api/app.js` to add endpoints
- edit `app.js` to change server properties

## how to run
- `npm i` 
- run using `npm start <PORT>`
- navigate to `http://localhost:<PORT>`
- don't worry
- be happy

## api

The api works by routing to `/api/app.js`. All parameters and body data are sent there and that file decides what to do with that information.

The function that the module exports contains the logic to handle api calls. For example:

```
let {action} = input;
```

This pulls the `action` out of the passed in body data.

We can handle the action here:
```
if(action == "getPosts")
{
	_okay(posts);
	return; // early return is important;
}
```

and if the action isn't found we simply call `_fail();` which is just a callback to our client.

Of course feel free to scrap all of that and handle it how you want. This is simply a middleware to the `connect` module created `app`
