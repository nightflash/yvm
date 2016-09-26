var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');


module.exports = function(config) {
  return function(filePath, params) {
    params = params || {};

    if (!params.version) {
      throw Error('Install(Error): You should specify version of the bundle');
    }

    var bundleDir = path.join(config.rootDir, String(params.version));

    mkdirp.sync(bundleDir);
    return fs.renameSync(
      filePath,
      path.join(bundleDir, 'youtrack-' + params.version + '.jar')
    );
  }
};
