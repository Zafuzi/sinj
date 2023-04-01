module.exports = {
    ping(input, okay)
    {
        okay("pong");
    },
    login(input, okay, fail)
    {
        const {email, password} = input;
        
        okay(input);
    }
}