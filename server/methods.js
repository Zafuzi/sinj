delete require.cache[module.filename];	// always reload

const users = require("sleepless-users");

module.exports = {
    ping(input, okay)
    {
        okay("pong");
    },
    login(input, okay, fail)
    {
        const {username, email, password} = input;
        users.connect("sqlite3", {}, (db) =>
        {
            db.authenticate({username, email, password}, (result) =>
            {
                okay(result);
            }, fail);
        }, fail);
    },
    register(input, okay, fail)
    {
        const {username, email, password} = input;
        users.connect("sqlite3", {}, (db) =>
        {
            db.register({username, email, password}, (result) =>
            {
                db.authenticate({username, email, password}, (result) =>
                {
                    okay(result);
                }, function(error)
                {
                    fail("User was created, but could not be authenticated. Please try logging in again.", error);
                });
            }, fail);
        }, fail);
    },
    getSession(input, okay, fail)
    {
        const {sid} = input;
        if(!sid)
        {
            fail("No session ID provided.");
            return;
        }
        
        users.connect("sqlite3", {}, (db) =>
        {
            db.get_session(sid, (result) =>
            {
                okay(result);
            }, fail);
        }, fail);
    }
};