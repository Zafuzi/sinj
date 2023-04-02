import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './header.less';

const Header = () => (
	<header className="container-1100 container-centered container-padded flex flex-row-nowrap align-center justify-space-between" id={"AppHeader"}>
		<a href="/" ><h1>KetoJS</h1></a>
		<nav className="flex flex-row-nowrap align-center gap-8">
			<Link activeClassName={style.active} href="/">Home</Link>
			<Link activeClassName={style.active} href="/about">About</Link>
			<Link activeClassName={style.active} href="/login">Login</Link>
		</nav>
	</header>
);

export default Header;
