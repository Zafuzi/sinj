sleepless.rplc8("#r8_version", {version: APP_VERSION});

Server.call("throw");

listen("#reloadPage", "click", function(event)
{
    window.location.reload();
});

listen("#callAPI-ping", "click", function(event)
{
    Server.call("ping", function(response)
    {
        alert("Message from ping: " + response);
    });
})
