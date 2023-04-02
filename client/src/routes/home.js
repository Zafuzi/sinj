import {getUserData, isLoggedIn, Session} from "../lib";
import {Component} from "preact";

class WelcomeSection extends Component {
    render (props, {}, context)
    {
        return (
            <div>
                <h1>Welcome home {props.user.username}</h1>
                <p>Your session id: {Session.get("sid")}</p>
            </div>
        )
    }
}

export default class Home extends Component {
    state = {
        user: {
            username: ""
        }
    }
    
    async componentDidMount()
    {
        const instance = this;
        const data = await getUserData();
        instance.setState({user: data?.user});
    }

    render (props, {user}, context)
    {
        return (
            <section className={"container-1100 container-centered container-padded"}>
                {!isLoggedIn() && <h1>Welcome home stranger...</h1>}
                {isLoggedIn() && <WelcomeSection user={user} />}
            </section>
        )
    }
};
