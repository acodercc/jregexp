/**
 *
 * jregexp
 *
 * refs:
 * http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap09.html
 * http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.5
 *
 */
var jregexp = (function(){

    var jcon = require('jcon');

    var epsilon = jcon.string('');

    //http://www.ecma-international.org/ecma-262/5.1/#sec-5.1.6
    var SourceCharacter = jcon.regex(/[\u0000-\uffff]/);

    //http://www.ecma-international.org/ecma-262/5.1/#sec-7.3
    var LineTerminator = jcon.or(
        jcon.regex(/\u000a/),
        jcon.regex(/\u000d/),
        jcon.regex(/\u2028/),
        jcon.regex(/\u2029/)
    );

    //http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.5
    var RegularExpressionNonTerminator = jcon.and(
        SourceCharacter.setAst('char'),
        jcon.not(LineTerminator)
    );

    var COLL_ELEM_SINGLE = jcon.and(
        jcon.regex(/[\u0000-\u00ff]/),
        jcon.not(jcon.string(']'))
    );
    var COLL_ELEM_MULTI = jcon.regex(/[\u00ff-\uffff]/);
    var BACKREF = jcon.regex(/\\[0-9]/);
    var DUP_COUNT = jcon.regex(/\d+/);
    var L_ANCHOR = jcon.string('^').setAst('start-of-line');
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
    var ORD_CHAR = jcon.not(SPEC_CHAR).setAst('char');
    var QUOTED_CHAR = jcon.seq(
        jcon.string('\\'),
        SPEC_CHAR
    );
    var R_ANCHOR = jcon.string('$').setAst('end-of-line');

    var backslashSequence = jcon.or(
        jcon.string('\\w').setAst('word'),
        jcon.string('\\W').setAst('non-word'),
        jcon.string('\\d').setAst('digit'),
        jcon.string('\\D').setAst('non-digit'),
        jcon.string('\\s').setAst('white space'),
        jcon.string('\\S').setAst('non-white space'),
        jcon.seq(
            jcon.string('\\'),
            jcon.and(
                jcon.regex(/[\u0000-\uffff]/),
                jcon.not(
                    jcon.or(
                        jcon.regex(/\u000a/),
                        jcon.regex(/\u000d/),
                        jcon.regex(/\u2028/),
                        jcon.regex(/\u2029/)
                    )
                )
            ).setAst('char')
        ),
        jcon.seq(
            jcon.string('\\u'),
            jcon.regex(/\d{4}/)
        ).setAst('unicode'),
        jcon.seq(
            jcon.string('\\x'),
            jcon.regex(/\d{2}/)
        ).setAst('hex')
    );

    var backOpenParen = jcon.string('(');
    var backCloseParen = jcon.string(')');
    var backOpenBrace = jcon.string('{');
    var backCloseBrace = jcon.string('}');


    var RegularExpressionClassChar = jcon.or(
        backslashSequence,
        jcon.and(
            RegularExpressionNonTerminator,
            jcon.not(
                jcon.or(
                    jcon.string('\\'),
                    jcon.string(']')
                )
            )
        )
    );
    var end_range = RegularExpressionClassChar;
    var start_range = jcon.seq(
        end_range,
        jcon.string('-')
    );
    var range_expression = jcon.seq(
        start_range,
        end_range
    ).setAst('range_expression');
    var single_expression = end_range;
    var expression_term = jcon.or(single_expression, range_expression.setAst('range'));

    var follow_list = expression_term.least(1);

    var bracket_list = jcon.or(follow_list, 
        jcon.seq(follow_list, jcon.string('-')),
        jcon.string('')
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

    /* bracket-expression defined */


    var RegularExpressionChar = jcon.or(
        jcon.and(
            RegularExpressionNonTerminator,
            jcon.not(
                jcon.or(
                    jcon.string('$'),           //$只能去匹配basic_reg_exp的rhs中的end-of-line
                    jcon.string('\\'),
                    jcon.string('/'),
                    jcon.string('[')
                )
            )
        ),
        backslashSequence,
        bracket_expression
    );


    var RegularExpressionFirstChar = jcon.or(
        jcon.and(
            RegularExpressionNonTerminator,
            jcon.not(
                jcon.or(
                    jcon.string('*'),
                    jcon.string('\\'),
                    jcon.string('/'),
                    jcon.string('[')
                )
            )
        ),
        backslashSequence,
        bracket_expression
    );

    var RegularExpressionChars = RegularExpressionChar.many();

    var RegularExpressionBody = jcon.seq(
        RegularExpressionFirstChar,
        RegularExpressionChars
    );

    var ERE_dupl_symbol = jcon.or(
        jcon.string('*').setAst('dupl-many'),
        jcon.string('+').setAst('dupl-one-more'),
        jcon.string('?').setAst('dupl-possible'),
        jcon.seq(
            jcon.string('{'),
            DUP_COUNT.setAst('dupl-fixed'),
            jcon.string('}')
        ),
        jcon.or(
            jcon.seq(
                jcon.string('{'),
                DUP_COUNT.setAst('min'),
                jcon.string(','),
                jcon.string('}')
            ),
            jcon.seq(
                jcon.string('{'),
                DUP_COUNT.setAst('min'),
                jcon.string(','),
                DUP_COUNT.setAst('max'),
                jcon.string('}')
            )
        ).setAst('dupl-range')
    );

    var one_char_or_elem_RE = jcon.or(
        jcon.string('.').setAst('wildcard'),
        //RegularExpressionChar,
        ORD_CHAR,
        bracket_expression
    );

    var nondupl_RE = jcon.or(
        one_char_or_elem_RE,
        jcon.seq(
            jcon.string('('),
            jcon.lazy(function(){
                return RE_expression;
            }),
            jcon.string(')')
        ).setAst('group-catch'),
        jcon.seq(
            jcon.string('(?='),
            jcon.lazy(function(){
                return extended_reg_exp;
                return RE_expression;
            }),
            jcon.string(')')
        ).setAst('group-positive'),
        jcon.seq(
            jcon.string('(?!'),
            jcon.lazy(function(){
                return extended_reg_exp;
                return RE_expression;
            }),
            jcon.string(')')
        ).setAst('group-negative'),
        jcon.seq(
            jcon.string('(?:'),
            jcon.lazy(function(){
                return extended_reg_exp;
                return RE_expression;
            }),
            jcon.string(')')
        ).setAst('group-non-catch'),
        BACKREF
    );

    var simple_RE = jcon.or(
        nondupl_RE,
        jcon.seq(nondupl_RE, ERE_dupl_symbol)
    );

    var RE_expression = simple_RE.least(1);

    var basic_reg_exp = jcon.or(
        L_ANCHOR,
        R_ANCHOR,
        jcon.seq(L_ANCHOR, R_ANCHOR),
        jcon.seq(L_ANCHOR, RE_expression),
        jcon.seq(L_ANCHOR, RE_expression, R_ANCHOR),
        jcon.seq(RE_expression, R_ANCHOR),
        RE_expression
    ).setAst('basic_RE');

    var extended_reg_exp = jcon.or(
        basic_reg_exp,
        jcon.seq(
            basic_reg_exp,
            jcon.string('|'),
            jcon.lazy(function(){
                return extended_reg_exp;
            })
        ).setAst('alter')
    ).setAst('extended_RE');

    return extended_reg_exp;

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
