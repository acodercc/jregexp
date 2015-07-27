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
parse('[\\u0061\\x61-bb\\d\\D\\z]');

//console.log(JSON.stringify(ptree, null, ' '));

//var atree = ptree.ast();

