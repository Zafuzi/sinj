import {Server, Session} from "../lib";
import { useState } from 'preact/hooks'
import style from './login.less';
import {Router} from "preact-router";

export default function()
{
    const [isRegister, setIsRegister] = useState(false); 
    const [loginError, setLoginError] = useState(null);
    
    const handleOnSubmit = async function(event)
    {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        
        const {error, result} = await Server.post(isRegister ? "register" : "login", {username, email, password});
    
        if(error)
        {
            setLoginError(error);
            console.error(error);
            return;
        }
        
        Session.set("sid", result, true);
        window.location.href = "/";
    }
    
    const toggleRegister = (event) => {
        event.preventDefault();
        setIsRegister(!isRegister);
        setLoginError(null);
    }

    return (
        <section className="container-500 container-centered container-padded">
            <form className="flex flex-column gap-8" id="loginForm" onSubmit={handleOnSubmit}>
                
                <div className={"flex flex-row-nowrap align-center justify-space-between"}>
                    <h1>{isRegister ? "Register" : "Login"}</h1>
                    {loginError && <span className={style.loginError}>{loginError}</span>}
                </div>


                <input type="text" name="username" placeholder="Username" required/>
                {isRegister && <input type="email" name="email" placeholder="Email" required/>}
                <input type="password" name="password" placeholder="Password" required/>

                {isRegister && <p>Already have an account? <a href="#" onClick={toggleRegister}>Login</a></p>}
                {!isRegister && <p>Need an account? <a href="#" onClick={toggleRegister}>Register</a></p>}
                
                <input type="submit" value={isRegister ? "Register" : "Login"} />
            </form>
        </section>
    )
}