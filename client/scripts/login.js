const authError = sleepless.rplc8("#authError");
const queryData = getQueryData();

const handleAuth = function(method, element)
{
    listen(element, "submit", function(event)
    {
        event.preventDefault();

        const username = event.target.username?.value?.toString() || null;
        const email = event.target.email?.value?.toString() || null;
        const password = event.target.password?.value?.toString() || null;

        const action = queryData?.action === "register" ? "register" : "login";

        Server.call("auth_" + action, {username, email, password}, function(response) {
            console.log(response);
            if(response?.sid)
            {
                Session.set("sid", response.sid, true);
            }
            
            sleepless.jmp("/");
        }, function(error) {
            console.error(error);
            authError.update({error});
        });
    });
}

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