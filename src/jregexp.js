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

    var epsilon = jcon.string('');

    var metaChr = jcon.or(
        jcon.string('\\'),
        jcon.string('^'),       //起始符
        jcon.string('$'),       //终止符
        jcon.string('*'),       //科林闭包
        jcon.string('+'),       //正闭包
        jcon.string('?'),       //零或一次
        jcon.string('.'),       //any char
        jcon.string('{'),       //指定次数闭包
        jcon.string('}'),       //指定次数闭包
        jcon.string('['),       //range start chr
        jcon.string(']'),       //range end chr
        jcon.string('('),       //group start chr
        jcon.string(')')        //group end chr
    );

    var nonMetaChr = jcon.or(
        jcon.not(metaChr).setAst('chr'),
        jcon.seq(jcon.string('\\'), metaChr.setAst('chr'))
    );

    var range = jcon.seq(
        nonMetaChr.setAst('range-start'),
        jcon.string('-'),
        nonMetaChr.setAst('range-end')
    ).setAst('range');

    var item = jcon.or(range, nonMetaChr);

    var items = item.least(1);

    var positiveSet = jcon.seq(
        jcon.string('['),
        items,
        jcon.string(']')
    ).setAst('positive-set');

    var negativeSet = jcon.seq(
        jcon.string('[^'),
        items,
        jcon.string(']')
    ).setAst('negative-set');

    var set = jcon.or(negativeSet, positiveSet);

    var eos = jcon.string('$');
    var any = jcon.string('.');
    var group = jcon.seq(
        jcon.string('('),
        jcon.lazy(function(){
            return union;
        }),
        jcon.string(')')
    );
    var reElementary = jcon.or(
        group,
        any,
        eos,
        nonMetaChr,
        set
    );
    var plus = jcon.seq(
        reElementary,
        jcon.string('+')
    );
    var star = jcon.seq(
        reElementary,
        jcon.string('*')
    );
    var basicRe = jcon.or(
        star,
        plus,
        reElementary
    );
    var concatenation = basicRe.least(1).setAst('concatenation');

    var union = jcon.lazy(function(){
        return jcon.seq(
            concatenation,
            unionRest
        );
    });
    var unionRest = jcon.or(
        epsilon,
        jcon.seq(
            jcon.string('|'),
            union
        )
    );

    var re = union;

    return re;

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
