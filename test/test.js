/*jshint expr: true*/

'use strict';

const chai = require('chai');
const expect = chai.expect;
const BrowserifyTransform = require('../');

var transform = new BrowserifyTransform({ test: true });

describe('transform', function() {

	it ('should return true when filename is .npm.js', () => {
		expect(transform.canTransform('my.browserify.js')).to.be.true;
	});

	it ('should return false when filename is .js', () => {
		expect(transform.canTransform('my.js')).to.be.false;
	});

	it ('should compile package', () => {
		return transform.compile(__dirname + '/nop.browserify.js', new Buffer('require("nop")')).then(result => {
			expect(result).to.be.an('object');
			expect(result.data).to.be.instanceOf(Buffer);
			expect(result.data.toString()).to.equal("(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error(\"Cannot find module '\"+o+\"'\");throw f.code=\"MODULE_NOT_FOUND\",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n'use strict';\n\nfunction nop(){}\n\nmodule.exports = nop;\n\n},{}],2:[function(require,module,exports){\nrequire(\"nop\")\n},{\"nop\":1}]},{},[2])\n");
		});
	});

});
