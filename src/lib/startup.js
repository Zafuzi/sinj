import {Route, Router} from "./lib.js";

const router = new Router([
	new Route('home', 'home/home', true),
	new Route('about', 'about/about'),
	new Route('nested', 'nested/nested_page/nested_page'),
]);

console.log(document.title);
