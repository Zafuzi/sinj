const handleAuth = function(method, element)
{
    element.addEventListener("submit", function(event)
    {
        event.preventDefault();

        const username = event.target.username?.value?.toString() || null;
        const email = event.target.email?.value?.toString() || null;
        const password = event.target.password?.value?.toString() || null;

        const action = queryData?.action === "register" ? "register" : "login";

        Server.call("auth_" + action, {username, email, password}, function(response) {
            if(response?.error) {
                return alert(response.error);
            }

            console.log("success");
        });
    });
}

const queryData = getQueryData();

const registerForm = sleepless.rplc8("#registerForm", null, function(element)
{
    handleAuth("register", element);
});
// registerForm.clear();

const loginForm = sleepless.rplc8("#loginForm", null, function(element)
{
    handleAuth("login", element);
});
// loginForm.clear();

if(!queryData.action)
{
    queryData.action = "login";
}

if(queryData.action === "register")
{
    registerForm.update({}, function(element)
    {
        handleAuth("register", element)
    });
    loginForm.clear();
}
else
{
    loginForm.update({}, function(element)
    {
        handleAuth("login", element)
    });
    
    registerForm.clear();
}