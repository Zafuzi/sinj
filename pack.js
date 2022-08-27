
const {src, dest} = require("gulp");
const path = require("path");
const babel = require("gulp-babel");
const fs = require("fs");
const cleanCSS = require("gulp-clean-css");
const htmlMin = require("gulp-htmlmin")
const CopyDir = require("copy-dir");



const REMOTE = process.env.REMOTE;

console.log("START");
console.log("\tDROP: ./dist");
fs.rmSync(path.resolve("./dist"), {recursive: true, force: true});

console.log("\tMINIFY: CSS");
src("./src/**/*.css")
.pipe(cleanCSS({compatibility: "ie8"}))
.pipe(dest("./dist/"));

console.log("\tMINIFY: JS");
src("./src/**/*.js")
.pipe(babel())
.pipe(dest("./dist/"));

console.log("\tMINIFY: HTML");
src("./src/**/*.html")
.pipe(htmlMin({collapseWhitespace: true}))
.pipe(dest("./dist/"));

console.log("\tMINIFY: HTML");
src("./src/**/*.html")
.pipe(htmlMin({collapseWhitespace: true}))
.pipe(dest("./dist/"));

console.log("\tMINIFY: IMAGES");

let imageLoader = async function()
{
	const GulpImage = await import("gulp-image");
	const imageExtensions = [
		"ase",
		"art",
		"bmp",
		"blp",
		"cd5",
		"cit",
		"cpt",
		"cr2",
		"cut",
		"dds",
		"dib",
		"djvu",
		"egt",
		"exif",
		"gif",
		"gpl",
		"grf",
		"icns",
		"ico",
		"iff",
		"jng",
		"jpeg",
		"jpg",
		"jfif",
		"jp2",
		"jps",
		"lbm",
		"max",
		"miff",
		"mng",
		"msp",
		"nef",
		"nitf",
		"ota",
		"pbm",
		"pc1",
		"pc2",
		"pc3",
		"pcf",
		"pcx",
		"pdn",
		"pgm",
		"PI1",
		"PI2",
		"PI3",
		"pict",
		"pct",
		"pnm",
		"pns",
		"ppm",
		"psb",
		"psd",
		"pdd",
		"psp",
		"px",
		"pxm",
		"pxr",
		"qfx",
		"raw",
		"rle",
		"sct",
		"sgi",
		"rgb",
		"int",
		"bw",
		"tga",
		"tiff",
		"tif",
		"vtf",
		"xbm",
		"xcf",
		"xpm",
		"3dv",
		"amf",
		"ai",
		"awg",
		"cgm",
		"cdr",
		"cmx",
		"dxf",
		"e2d",
		"egt",
		"eps",
		"fs",
		"gbr",
		"odg",
		"svg",
		"stl",
		"vrml",
		"x3d",
		"sxd",
		"v2d",
		"vnd",
		"wmf",
		"emf",
		"art",
		"xar",
		"png",
		"webp",
		"jxr",
		"hdp",
		"wdp",
		"cur",
		"ecw",
		"iff",
		"lbm",
		"liff",
		"nrrd",
		"pam",
		"pcx",
		"pgf",
		"sgi",
		"rgb",
		"rgba",
		"bw",
		"int",
		"inta",
		"sid",
		"ras",
		"sun",
		"tga",
		"heic",
		"heif"
	];
	src(imageExtensions.map(function(ext)
	{
		return "./src/**/*." + ext;
	}))
	.pipe(GulpImage.default())
	.pipe(dest("./dist/"));
}

imageLoader();

fs.mkdirSync(path.resolve("dist", "fonts"), {recursive: true});
CopyDir.sync("./src/fonts/", "./dist/fonts/")

console.log("DONE");

