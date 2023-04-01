/* 
    Buildind consists of the following steps:
        1. Read the source files
        2. Parse the source files
            a. Turn less into css
        3. Generate the output files
            a. Minify the output files
        4. Write the output files
 */

const fse = require("fs-extra");
const path = require("path");
const MinifyAll = require("uglify-js-minify-css-allfiles");

const HERE = path.dirname(module.filename);
const L = require("sleepless").log5.mkLog("mb/build ")(5);

const config = require(HERE + "/settings.json");

if(!config)
{
    throw new Error("Failed to read settings.json");
}

fse.ensureDirSync(HERE + "/dist", {});
fse.emptydirSync(HERE + "/dist");

if(fse.pathExistsSync(HERE + "/dist/public"))
{
    fse.copySync(HERE + "/public", HERE + "/dist/public", {overwrite: true, dereference: true});
}

fse.copySync(HERE + "/server", HERE + "/dist/server", {overwrite: true, dereference: true});
fse.copySync(HERE + "/client", HERE + "/dist/client", {overwrite: true, dereference: true});

MinifyAll("./dist/");