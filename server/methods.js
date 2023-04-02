module.exports = {
    ping(input, okay)
    {
        okay("pong");
    },
    login(input, okay, fail)
    {
        const {email, password} = input;
        
        fail("Not implemented");
    },
    register(input, okay, fail)
    {
        const {email, password} = input;
        
        fail("Not implemented");
    }
}