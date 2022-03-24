
homes = [
	{name: "Palace"},
	{name: "Hovel"},
];

console.log( require( "./shelp.js" )( require("fs").readFileSync("./test.html", "utf8" ) ) );

