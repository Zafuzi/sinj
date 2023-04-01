const routes = [
    {
        path: '/',
        name: 'home',
        view: "pages/home.ejs",
        async onBeforeAction()
        {
            return {
                message: "Welcome home sailor..."
            }
        }
    },
    {
        path: '/about',
        name: 'about',
        view: "pages/about.ejs"
    }
]

module.exports = routes;