'use strict';

const path = require('path');
const fs = require('fs');

const browserify = require('browserify');
const merge = require('merge');
const streamifier = require('streamifier');

const Transform = require('@donotjs/donot-transform');

class BrowserifyTransform extends Transform {

	constructor(options) {
		super();

		options = options || {};

		this.options = merge(options || {}, {
			debug: true,
			paths: [
				(options.test ? __dirname + '/node_modules' : path.resolve(__dirname + '/', '../../')),
				'.'
			]
		});

	}

	canTransform(filename) {
		return /\.browserify\.js/i.test(filename);
	}

	map(filename) {
		return filename.replace(/\.browserify\.js/i, '.js');
	}

	compile(filename, data, map) {
		return new Promise((resolved, rejected) => {

			var buffer = new Buffer([]);
			var files = [];

			var options = merge(true, this.options, {
				basedir: path.dirname(filename),
				file: filename
			});

			var b = browserify(options);
			b.add(streamifier.createReadStream(data))
			.bundle()
			.on('data', data => {
				buffer = Buffer.concat([buffer, data]);
			})
			.on('end', () => {

				// Un-inline source map.

				var r = /\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,(.*)\n$/;
				var source = buffer.toString();
				var sourceMap;
				try { sourceMap = JSON.parse(new Buffer(source.match(r)[1], 'base64').toString()); }
				catch (e) {}

				source = source.replace(r, '');

				resolved({
					data: new Buffer(source),
					map: sourceMap,
					files: files
				});

			})
			.on('error', err => {
				rejected(err);
			});
			b.pipeline.on('file', file => {
				files.push(file);
			});

		});
	}

}

module.exports = exports = BrowserifyTransform;
