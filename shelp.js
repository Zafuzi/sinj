
// SHELP - shitty html embedded logic parser

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
	}

	function evaluate( s ) {
		return Function("\"use strict\";return ("+s+")")();
	}

	function dumpargs( arr ) {
		arr.forEach( ( s, i ) => {
			s = s ? s.trim() : null;
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
			dumpargs(m);
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
			let t_blk = read_blk();	// read the "true" block

			// look ahead one line and see if it's an "else"
			let la = get_line();
			let { cmd, exp } = extract_cmd( line );
			let f_blk = ( cmd == "else" ) ? read_blk() : "";

			if( evaluate(exp) ) {
				return t_blk;
			}

			return f_blk;
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



