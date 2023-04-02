module.exports = {
    eq(v1, v2)
    {
        return v1 === v2;
    },
    o2j(obj)
    {
        return JSON.stringify(obj || {});
    },
    isActiveRoute(route, currentRoute)
    {
        return route === currentRoute ? "active" : "";
    }
}