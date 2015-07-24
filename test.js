var jregexp = require('./src/jregexp.js');

console.log( jregexp.parse('\\').ast() );
console.log( jregexp.parse('\\\\').ast() );


//jregexp.parse('abc(?:ab|[^b|c]+|\d)*');
