/**
 *
 * jregexp
 *
 * refs:
 * http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap09.html
 *
 */
var jregexp = (function(){

    var jcon = require('jcon');

    var epsilon = jcon.string('');

    var META_CHAR = jcon.or(
        //jcon.string('^'),
        //jcon.string('-'),
        jcon.string(']')
    );
    var COLL_ELEM_SINGLE = jcon.and(
        jcon.regex(/[\u0000-\u00ff]/),
        jcon.not(META_CHAR)
    );
    var COLL_ELEM_MULTI = jcon.regex(/[\u00ff-\uffff]/);
    var BACKREF = jcon.regex(/\\[0-9]/);
    var DUP_COUNT = jcon.regex(/\d+/);
    var L_ANCHOR = jcon.string('^');
    var SPEC_CHAR = jcon.or(
        jcon.string('^'),
        jcon.string('.'),
        jcon.string('['),
        jcon.string('$'),
        jcon.string('('),
        jcon.string(')'),
        jcon.string('|'),
        jcon.string('*'),
        jcon.string('+'),
        jcon.string('?'),
        jcon.string('{'),
        jcon.string('\\')
    );
    var ORD_CHAR = jcon.not(SPEC_CHAR);
    var QUOTED_CHAR = jcon.seq(
        jcon.string('\\'),
        SPEC_CHAR
    );
    var R_ANCHOR = jcon.string('$');

    var backOpenParen = jcon.string('(');
    var backCloseParen = jcon.string(')');
    var backOpenBrace = jcon.string('{');
    var backCloseBrace = jcon.string('}');


    var end_range = COLL_ELEM_SINGLE;
    var start_range = jcon.seq(
        end_range,
        jcon.string('-')
    );
    var range_expression = jcon.seq(
        start_range,
        end_range
    ).setAst('range_expression');
    var single_expression = end_range;
    var expression_term = jcon.or(single_expression.setAst('single'), range_expression.setAst('range'));

    /*
    var follow_list = jcon.or(expression_term, 
        jcon.seq(follow_list, expression_term);     //左第归
    */

    var follow_list = expression_term.least(1);

    var bracket_list = jcon.or(follow_list, 
        jcon.seq(follow_list, jcon.string('-'))
    );
    
    var bracket_expression = jcon.or(
        jcon.seq(
            jcon.string('[^').skip(),
            bracket_list,
            jcon.string(']').skip()
        ).setAst('nomaching_list'),
        jcon.seq(
            jcon.string('[').skip(),
            bracket_list,
            jcon.string(']').skip()
        ).setAst('maching_list')
    );

    return bracket_expression;


})();
(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }

}('jregexp', jregexp));
