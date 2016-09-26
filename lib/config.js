var path = require('path');
var merge = require('mout/object/merge');


module.exports.createConfig = function(data, processEnv) {
  return merge({
    rootDir: getDefaultRootDir(processEnv),
    create: createConfig
  }, data);
};


function createConfig(data) {
  return merge({}, this, data);
}

function getDefaultRootDir(processEnv) {
  return path.resolve(getUserHome(processEnv), '.youtrack', 'builds');
}


function getUserHome(processEnv) {
  processEnv = processEnv || process.env;

  return processEnv.HOME || processEnv.USERPROFILE;
}
