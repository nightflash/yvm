var fillIn = require('mout/object/fillIn');


module.exports = function(config) {
  return function(buildNumber, params) {
    return require('./install-remote')(
      config.create({progress: true, buildNumber: buildNumber}),
      onDownloadBuild
    );

    function onDownloadBuild(error, buildFile) {
      if (error) {
        console.error(error);
        return;
      }

      require('./run')(config)(buildNumber, fillIn({jar: buildFile.path}, params))
    }
  }
};
