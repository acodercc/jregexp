/**
 *
 * jregexp
 *
 * refs:
 * http://www.cs.sfu.ca/~cameron/Teaching/384/99-3/regexp-plg.html
 *
 */
var jregexp = (function(){

    var jcon = require('jcon');

    var metaChr = jcon.or(
        jcon.string('\\'),
        jcon.string('^'),       //起始符
        jcon.string('$'),       //终止符
        jcon.string('*'),       //科林闭包
        jcon.string('+'),       //正闭包
        jcon.string('?'),       //零或一次
        jcon.string('.'),       //any char
        jcon.string('{'),       //指定次数闭包
        jcon.string('['),       //range start chr
        jcon.string('(')       //group start chr
    );

    var chr = jcon.or(
        jcon.not(metaChr).setAst('chr'),
        jcon.seq(jcon.string('\\'), metaChr.setAst('chr'))
    );



    return chr;

}());

(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }

}('jregexp', jregexp));
