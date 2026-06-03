import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import { engine } from "express-handlebars";
import path from "node:path";
import { Sanitizer } from "sanitize";
import strip from "strip";

const app = express();
const jsonParser = bodyParser.json();
const sanitizer = new Sanitizer();

app.use(express.static('public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(import.meta.dirname, "views"));

app.get("/", (req, res) => {
	res.render("home");
})

app.get("/about", (req, res) => {
	res.render("about");
})

app.listen(3000, function () {
	console.log('Your app is listening on port 3000');
});