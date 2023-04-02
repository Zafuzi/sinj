import {sid, isLoggedIn} from "../lib";

export default function()
{
    return (
        <section className={"container-1100 container-centered container-padded"}>
            {isLoggedIn() && <h1>Welcome home friend... {sid.value}</h1>}
            {!isLoggedIn() && <h1>Welcome home stranger... {sid.value}</h1>}
        </section>
    );
};
