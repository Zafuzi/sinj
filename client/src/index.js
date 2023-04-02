import "@csstools/normalize.css";
import "coughdrop/variables.import.less";
import "coughdrop/general.import.less";
import "coughdrop/fonts.import.less";
import "./water.min.css";
import './app.less';

import {Router} from 'preact-router';
import {getUserData} from "./lib";

import Header from './components/header/header.js';
import Home from './routes/home.js';
import About from './routes/about.js';
import Login from './routes/login.js';

const App = () => (
    <div id="app">
        <Header />
        <main className={"container-1100 container-centered"}>
            <Router>
                <Home path="/" />
                <About path="/about" />
                <Login path="/login" />
            </Router>
        </main>
    </div>
);

export default App;
