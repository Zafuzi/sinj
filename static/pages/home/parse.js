
// SHELP - shitty html embedded logic parser

require("sleepless");

module.exports = function( input ) {

	let ln = 0;
	let depth = 0;

	let lines = input.split( "\n" );

	function get_line() {
		let line = lines.shift();
		ln += 1;
		//log("-------- "+depth+" "+ln+": "+line);
		return line;
	}
	function unget_line( line ) {
		lines.unshift( line );
	}

	function expr( s ) {
		return Function("\"use strict\";return ("+s+")")();
	}

	function dumpargs( arr ) {
		arr.forEach( ( s, i ) => {
			s = s ? s.trim() : null;
			log( "  ["+i+"]="+o2j(s) );
		});
	}

	function get_cmd( s ) {
		return s .lcase() .replace( /[^a-z]/g, " " ) .trim() .split( /\s+/ ) .shift();
	}

	function extract_cmd( line ) {
		const re = /^(\w*)(.*){$/;
		let cmd = null;
		let exp = null;
		let m = line.trim().match( re );
		if( m ) {
			cmd = m[ 1 ];
			exp = m[ 2 ].trim();
		}
		return { cmd, exp };

	}

	function grok( line ) {

		log( "----- "+line );
		let { cmd, exp } = extract_cmd( line );
		if( ! cmd ) {
			// no logic - just return the line
			return line;
		}

		if( line.trim() == "}" ) {
			// end of block
			return null;
		}

		if( cmd == "if" ) {
			//let exp = m[2].trim();	// the expression to test
			log("!!! IF ( "+exp+" )" );

			let t_blk = read_blk();	// read the "true" block

			let la = get_line(); // look ahead 1 line
			let f_blk = null;

			if( expr(exp) ) {
				// expression is true ...
				log( ">>> TRUE " );
			} else {
				// expression was false
				log( ">>> FALSE " );
				let line = get_line(); // look ahead 1 line
				if( cmd == "else" ) {
					// it's an else
					blk = read_blk();	// read the next block
				}
			}
			return blk;
		}

		if( cmd == "replicate" ) {
			log("!!! REPLICATE ( "+exp+" )" );
			let r_blk = read_blk();	// read a block
			let data = expr(exp);
			if( ! data || ! (data instanceof Array)) {
				throw new Error( "Invalid replicate data "+exp );
			}
			let out = ""
			log(o2j(data));
			for( let d of data ) {
				out += r_blk+"\n";
			}
			return out;
		}

		throw new Error( "bogus command line: "+line.trim() );
	}

	function read_blk() {
		depth++;
		log( "__ BLOCK >>>" );
		let out = ""
		while( lines.length > 0 ) {
			let line = get_line();
			let out = grok( line );
			if( out === null ) {
				// block ended
				break;
			}
			out += line;
		}
		log( out );
		log( "__ _____ <<<" );
		depth--;
		return out;
	}

	return read_blk();
};

if(require && require.main === module) {
	// module is being executed directly
	let fs = require("fs");
	let txt = fs.readFileSync(process.argv[2], "utf8");
	let out = module.exports( txt );
	log(out);
}


