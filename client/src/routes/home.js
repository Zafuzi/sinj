import {sid, isLoggedIn, Session} from "../lib";

export default function()
{
    return (
        <section className={"container-1100 container-centered container-padded"}>
            {isLoggedIn() && <h1>Welcome home friend... {Session.get("sid")}</h1>}
            {!isLoggedIn() && <h1>Welcome home stranger...</h1>}
        </section>
    );
};
