var jregexp = require('./src/jregexp.js');


var ast = jregexp.parse('abc(?:ab|[^bc]+|\\d)*').ast();

console.log(JSON.stringify(ast, null, '  '));
