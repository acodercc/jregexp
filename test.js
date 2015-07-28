var jregexp = require('./src/jregexp.js');

function parse(str){
    console.log('parse:' + str);
    console.log(JSON.stringify(jregexp.parse(str).ast(), null, ' '));
    console.log();
}

/*
parse('[abc]');
parse('[^abc]');
parse('[^^abc]');
parse('[^a-]');
parse('[^-b]');
parse('[^-]');
parse('[^a-b]');
parse('[^a-bcd]');
parse('[^[-]');
parse('[\\?]');
parse('[\\u0061b]');
*/
parse('.{1,2}[^\\d\\u0061-\\x65]*\w{2}');

//console.log(JSON.stringify(ptree, null, ' '));

//var atree = ptree.ast();

