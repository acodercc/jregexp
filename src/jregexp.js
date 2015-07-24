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
        jcon.string('|'),       //any char
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


    var group = jcon.or(
        jcon.seq(
            jcon.string('('),
            jcon.lazy(function(){
                return alter;
            }),
            jcon.string(')')
        ).setAst('group'),

        jcon.seq(
            jcon.string('(?:'),
            jcon.lazy(function(){
                return alter;
            }),
            jcon.string(')')
        ),

        jcon.seq(
            jcon.string('(?='),
            jcon.lazy(function(){
                return alter;
            }),
            jcon.string(')')
        ).setAst('positive-group'),

        jcon.seq(
            jcon.string('(?!'),
            jcon.lazy(function(){
                return alter;
            }),
            jcon.string(')')
        ).setAst('negative-group')
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
    ).setAst('plus');
    var star = jcon.seq(
        reElementary,
        jcon.string('*')
    ).setAst('star');
    var basicRe = jcon.or(
        star,
        plus,
        reElementary
    );
    var concatenation = jcon.or(
        basicRe,
        basicRe.least(2).setAst('concatenation')
    );

    var alter = jcon.lazy(function(){
        return jcon.or(
            concatenation,
            jcon.seq(
                concatenation,
                alterRest
            ).setAst('alter')
        );
    });
    var alterRest = jcon.or(
        epsilon,
        jcon.seq(
            jcon.string('|'),
            alter
        )
    );

    var re = alter;

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
