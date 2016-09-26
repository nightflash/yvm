var fs = require('fs');
var path = require('path');


module.exports = function(config) {
  return function(buildNumbersList) {
    var installedBuilds = require('./ls')(config)();
    buildNumbersList = [].concat(buildNumbersList);


    var buildsListForRemove = installedBuilds.filter(function(iBuildNumber) {
      return buildNumbersList.some(function(buildNumber) {
        if (buildNumber.indexOf('*') > -1) {
          return iBuildNumber.match(buildNumber.replace('*', ''));
        }

        return buildNumber === iBuildNumber;
      });
    });


    buildsListForRemove.forEach(function(buildNumber) {
      var bundleDir = path.join(config.rootDir, String(buildNumber));
      return rmdirr(bundleDir);
    });
  };


  function rmdirr(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    fs.readdirSync(dirPath).forEach(function(file) {
      var filePath = path.join(dirPath, file);
      return (fs.statSync(filePath).isFile()) ? fs.unlinkSync(filePath) : rmdirr(filePath);
    });

    fs.rmdirSync(dirPath);
  }
};