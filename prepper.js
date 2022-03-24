
// Joe's SHELP - shitty html embedded logic parser
// rename this shit hudson!

delete require.cache[module.filename];	// always reload

sleepless = require("sleepless");

module.exports = function( input ) {

	let ln = 0;
	let depth = 0;

	let lines = input.split( "\n" );

	function get_line() {
		let line = lines.shift();
		ln += 1;
		return line;
	}
	function unget_line( line ) {
		lines.unshift( line );
		ln -= 1;
	}

	function evaluate( s ) {
		return Function("\"use strict\";return ("+s+")")();
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

	let inject = function( s, data ) {
		for( let key in data ) {
			let re = new RegExp( "__" + key + "__", "g" );
			s = s.replace( re, ""+(data[ key ]) );
		}
		return s;
	}

	function grok( line ) {

		if( line.trim() == "}" ) {
			// end of block
			return null;
		}

		let { cmd, exp } = extract_cmd( line );
		if( ! cmd ) {
			// no logic - just return the line
			return line;
		}

		if( cmd == "if" ) {
			let true_blk = read_blk();	// read the "true" block

			// look ahead one line and see if it's an "else"
			let la = get_line();
			let x = extract_cmd( la );
			let false_blk = "";
			if( x.cmd == "else" ) {
				false_blk = read_blk();
			} else {
				unget_line( la );
			}

			if( evaluate(exp) ) {
				return true_blk;
			}

			return false_blk;
		}

		if( cmd == "replicate" ) {
			let r_blk = read_blk();	// read a block
			let data = evaluate( exp );
			if( ! data || ! (data instanceof Array)) {
				throw new Error( "Invalid replicate data: "+o2j(data) );
			}
			let out = ""
			for( let d of data ) {
				let b = inject( r_blk, d );
				out += b+"\n";
			}
			return out;
		}

		throw new Error( "bogus command line: "+line.trim() );
	}

	function read_blk() {
		depth++;
		let out = ""
		while( lines.length > 0 ) {
			let line = grok( get_line() );
			if( line === null )
				break; // block ended
			out += line + "\n";
		}
		depth--;
		return out;
	}

	return read_blk();
};



