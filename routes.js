const routes = [
    {
        path: "/",
        name: "home",
        view: "pages/home.ejs",
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
        view: "pages/about.ejs"
    },
    {
        path: "/login",
        name: "login",
        view: "pages/login.ejs"
    },
    {
        path: "/register",
        name: "register",
        view: "pages/register.ejs"
    }
]

module.exports = routes;