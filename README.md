donot-transform-browserify
==========================

[![Build Status](https://travis-ci.org/donotjs/donot-transform-browserify.svg?branch=master)](https://travis-ci.org/donotjs/donot-transform-browserify)

[Browserify](http://npmjs.org/packages/browserify) transform for [donot](http://github.com/donotjs/donot).

# Usage

Using the browserify donot transform plug-in is pretty easy.

	var http = require('http'),
	    donot = require('donot'),
	    BrowserifyTransform = require('donot-transform-browserify');

	var server = http.createServer(donot(__dirname + '/public', {
		transforms: [ new BrowserifyTransform({
			// Options
		}) ]
	}));

	server.listen(8000);

Now `.js` files in the `/public` folder will automatically be compiled, rendered and served as browserify compiled versions with the `.browserify.js` extension.

# License

MIT
