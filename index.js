'use strict';

const path = require('path');
const fs = require('fs');

const browserify = require('browserify');
const merge = require('merge');
const tmp = require('tmp');

const Transform = require('@donotjs/donot-transform');

class BrowserifyTransform extends Transform {

	constructor(options) {
		super();

		options = options || {};

		this.options = merge(options || {}, {
			debug: true,
			paths: (options.test ? __dirname + '/node_modules' : path.resolve(__dirname + '/', '../../'))
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

			tmp.file((err, tmpfile, fd, cleanup) => {
				if (err) return rejected(err);

				fs.writeFile(tmpfile, data, err => {
					if (err) return rejected(err);

					var buffer = new Buffer([]);
					var files = [];

					var b = browserify(merge(true, this.options, {
						basedir: path.dirname(filename),
						filename: filename
					}));
					b.add(tmpfile)
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

						cleanup();

					})
					.on('error', err => {
						rejected(err);
						cleanup();
					});
					b.pipeline.on('file', file => {
						files.push(file);
					});

				});

			});

		});
	}

}

module.exports = exports = BrowserifyTransform;
