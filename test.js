var jregexp = require('./src/jregexp.js');

console.log( JSON.stringify(jregexp.parse('a[abA-Z](a|b)').ast(), null, ' ') );

/*
var jcon = require('jcon');

console.log( jcon.seq(jcon.string('['), jcon.not(jcon.string(']')), jcon.string(']')).parse('[a]') );
*/

//jregexp.parse('abc(?:ab|[^b|c]+|\d)*');
