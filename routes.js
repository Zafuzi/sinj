const routes = [
    {
        path: "/",
        name: "home",
        view: "pages/home",
        async onBeforeAction()
        {
            return {
                message: "Welcome home sailor..."
            }
        }
    },
    {
        path: "/about",
        name: "about",
        view: "pages/about"
    },
    {
        path: "/login",
        name: "login",
        view: "pages/login",
        async onBeforeAction(queryData)
        {
            const action = queryData.get("action") || "login";
            if(["register", "login"].indexOf(action) === -1)
            {
                return {action: "login"};
            }
            return {action}
        }
    },
]

module.exports = routes;