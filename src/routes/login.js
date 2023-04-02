import {Server} from "../index";
import { useState } from 'preact/hooks'
import {Link} from "preact-router/match";

export default function()
{
    const [isRegister, setIsRegister] = useState(false); 
    const [loginError, setLoginError] = useState("");
    
    const handleOnSubmit = async function(event)
    {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        const email = formData.get("email");
        const password = formData.get("password");
    
        const {error, result} = await Server.post(isRegister ? "register" : "login", {email, password});
    
        if(error)
        {
            setLoginError(error);
            console.error(error);
            return;
        }
    
        console.log(result);
    }
    
    const toggleRegister = (event) => {
        event.preventDefault();
        setIsRegister(!isRegister);
    }

    return (
        <section className="container-500 container-centered container-padded">
            <form className="flex flex-column gap-8" id="loginForm" onSubmit={handleOnSubmit}>
                
                <div className={"flex flex-row-nowrap align-center justify-space-between"}>
                    <h1>{isRegister ? "Register" : "Login"}</h1>
                    <span className="assertive">{loginError}</span>
                </div>

                
                <input type="email" name="email" placeholder="Email" required/>
                <input type="password" name="password" placeholder="Password" required/>

                {isRegister && <p>Already have an account? <a href="#" onClick={toggleRegister}>Login</a></p>}
                {!isRegister && <p>Need an account? <a href="#" onClick={toggleRegister}>Register</a></p>}
                
                <input type="submit" value={isRegister ? "Register" : "Login"} />
            </form>
        </section>
    )
}