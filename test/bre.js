
'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('bracket', function(){

    var jregexp = require('../src/jregexp');

    jregexp.parse('.{1,2}[^\\d\\u0061-\\x65]*\\w{2}').ast()[0].should.contain.keys({'value': '.{1,2}[^\\d\\u0061-\\x65]*\\w{2}'}); 

});
