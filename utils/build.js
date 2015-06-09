var fs = require('fs');
var path = require('path');
var compressor = require('node-minify');
var CleanCSS = require('clean-css');

var license = path.resolve(__dirname, '../license.txt');
var styles = path.resolve(__dirname, '../styles/transition.css');
var source = path.resolve(__dirname, '../src/transition.js');

fs.readFile(styles, { encoding: 'utf-8' }, function(err, css) {
  if (err) {
    throw err;
  }
  fs.readFile(source, { encoding: 'utf-8'}, function(err, javascript) {
    if (err) {
      throw err;
    }

    var result = javascript.replace(/\'\$1\'/i, '\'' + new CleanCSS().minify(css).styles + '\'');
    fs.writeFile(path.resolve(__dirname, '../build/transition.js'), result, function(err) {
      if (err) {
        throw err;
      }

      new compressor.minify({
        type: 'no-compress',
        fileIn: [license, path.resolve(__dirname, '../build/transition.js')],
        fileOut: path.resolve(__dirname, '../build/transition.js'),
        callback: function(err, min) {
          if (err) {
            throw err;
          }

          console.log('Transition.js: Concatenation complete.');

          new compressor.minify({
              type: 'uglifyjs',
              fileIn: path.resolve(__dirname, '../build/transition.js'),
              fileOut: path.resolve(__dirname, '../build/transition.min.js'),
              callback: function(err, min) {
                if (err) {
                  throw err;
                }

                new compressor.minify({
                  type: 'no-compress',
                  fileIn: [license, path.resolve(__dirname, '../build/transition.min.js')],
                  fileOut: path.resolve(__dirname, '../build/transition.min.js'),
                  callback: function(err, min) {
                    if (err) {
                      throw err;
                    }

                    console.log('Transition.js: Minification complete.');

                  }
                });

              }
          });

        }
      });

    });

  });

});