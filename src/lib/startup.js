import {Route, Router, rplc8} from "./lib.js";

const router = new Router([
	new Route('home', 'home/home', true),
	new Route('about', 'about/about', true),
	new Route('nested', 'nested/nested_page/nested_page', true),
]);

console.log(document.title);
