
const path = require("path");
const fs = require("fs");
const CopyDir = require("copy-dir");


console.log("START");
console.log("\tDROP: ./dist");
fs.rmSync(path.resolve("./dist"), {recursive: true, force: true});

console.log("\tCOPY: ./src/ -> ./dist/");
CopyDir.sync("./src/", "./dist/")

console.log("DONE");

