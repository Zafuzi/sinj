const path = require("path");
const fs = require("fs");
const CopyDir = require("copy-dir");
const MinifyAll = require("uglify-js-minify-css-allfiles");


console.log("START");
console.log("\tDROP: ./dist");
fs.rmSync(path.resolve("./dist"), {recursive: true, force: true});

console.log("\tCOPY: ./client/ -> ./dist/");
CopyDir.sync("./client/", "./dist/")

MinifyAll("./dist/");

console.log("DONE");

