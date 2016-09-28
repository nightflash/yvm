var fs = require('fs');
var printBuildNumber = require('../lib/print-build-number').printBuildNumber;


module.exports = function(config) {
  function ls() {
    var rootDir = config.rootDir;

    if (fs.existsSync(rootDir)) {
      return fs.readdirSync(rootDir)
        .map(toNumber)
        .sort(function(a, b) {
          return b - a;
        })
        .map(toString);
    }

    return [];
  }

  ls.print = function() {
    ls().forEach(printBuildNumber.bind(null, true));
  };

  return ls;


  function toNumber(it) {
    return Number(it);
  }


  function toString(it) {
    return String(it);
  }
};