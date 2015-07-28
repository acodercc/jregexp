'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('Bracket Expression', function(){

    var jregexp = require('../src/jregexp');

    jregexp.parse('[]').ast()[0].should.contain.keys({'value': '', type:'maching_list'}); 
    jregexp.parse('[^]').ast()[0].should.contain.keys({'value': '', type:'nomaching_list'}); 
    jregexp.parse('[abc]').ast()[0].should.contain.keys({'value': 'abc', type:'maching_list'}); 
    jregexp.parse('[^abc]').ast()[0].should.contain.keys({'value': 'abc', type:'nomaching_list'}); 
    jregexp.parse('[^^abc]').ast()[0].should.contain.keys({'value': '^abc', type:'nomaching_list'}); 
    jregexp.parse('[^-]').ast()[0].should.contain.keys({'value': '-', type:'nomaching_list'}); 
    jregexp.parse('[^a-]').ast()[0].should.contain.keys({'value': 'a-', type:'nomaching_list'}); 
    jregexp.parse('[^-a]').ast()[0].should.contain.keys({'value': '-a', type:'nomaching_list'}); 
    jregexp.parse('[^a-b]').ast()[0].should.contain.keys({'value': 'a-b', type:'nomaching_list'}); 
    jregexp.parse('[^[-]').ast()[0].should.contain.keys({'value': '[-', type:'nomaching_list'}); 
    jregexp.parse('[\\u0061b]').ast()[0].should.contain.keys({'value': '\\u0061b', type:'nomaching_list'}); 
    jregexp.parse('[\\u0061\\x61-bb\\d\\D\\z]').ast()[0].should.contain.keys({'value': '\\u0061\\x61-bb\\d\\D\\z', type:'maching_list'}); 


});
