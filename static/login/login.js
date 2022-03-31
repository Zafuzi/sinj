// handle login
let loginForm = document.querySelector("#loginForm");

/**
 * Integration and Unit tests
 */
if(TEST)
{
	if(!loginForm)
	{
		fail("Login form is missing on login page\nExpected to find #loginForm");
	}

	let username = loginForm.querySelector("[name=username]");
	if(!username)
	{
		fail("username input not found in loginForm");
	}
	username.value = "foo";

	let password = loginForm.querySelector("[name=password]");
	if(!password)
	{
		fail("password input not found in loginForm");
	}
	password.value = "bar";

	let loginButton = loginForm.querySelector("[type=submit]");
	if(!loginButton)
	{
		fail("submit button is missing from loginForm")
	}

	// attempt dummy login
	sleepless.rpc("/api/", {action: "login", username: username.value, password: password.value}, function(result)
	{
		console.log("Login integration test passed");
	}, fail, true);

	username.value = "";
	password.value = "";
}
