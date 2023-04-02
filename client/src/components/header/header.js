import style from './header.less';
import {Link} from "preact-router/match";
import {isLoggedIn, logout} from "../../lib";

const Header = (props) => {
    return (
        <header className="container-1100 container-centered container-padded flex flex-row-nowrap align-center justify-space-between" id={"AppHeader"}>
            <a href="/" ><h1>sinj</h1></a>
            <nav className="flex flex-row-nowrap align-center gap-24">
                <Link activeClassName={style.active} href="/">Home</Link>
                <Link activeClassName={style.active} href="/about">About</Link>

                {isLoggedIn() ?
                    <button onClick={logout}>Logout</button> :
                    <Link activeClassName={style.active} href="/login">Login</Link>}
            </nav>
        </header>
    );
}

export default Header;
