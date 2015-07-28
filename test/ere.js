'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('ERE Grammar', function(){

    var jregexp = require('../src/jregexp');

    jregexp.parse('^ab$|^cd$').ast()[0].should.contain.keys({'value': '^ab$|%cd$'}); 

});
