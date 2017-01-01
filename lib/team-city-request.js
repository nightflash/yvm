var request = require('./request');
var addPath = request.addPath;
var addHeader = request.addHeader;
var addQuery = request.addQuery;
var compose = require('mout/function/compose');


var addJsonHeader = addHeader({'Accept': 'application/json'});
var addGuestAuth = addPath('/guestAuth/');
var addRestPath = addPath('app/rest/');
var addCommonBuildsRequestParameters = compose(
  addPath('builds/'),
  addRestPath,
  addGuestAuth,
  addJsonHeader
);


module.exports.createRequest = request.createRequest;


module.exports.createBuildListRequest = compose(
  addQuery({count: '10'}),
  addQuery({locator: 'status:SUCCESS,buildType:(buildTypeId)'}),
  addCommonBuildsRequestParameters
);


module.exports.createBuildArtifactsRequest = compose(
  addPath('./artifacts'),
  addPath('./buildType:(buildTypeId),number:(buildNumber)/'),
  addCommonBuildsRequestParameters
);

module.exports.createBuildArtifactRequest = compose(
  addPath('./content/(artifactName)'),
  addPath('./artifacts/'),
  addPath('./buildType:(buildTypeId),number:(buildNumber)/'),
  addCommonBuildsRequestParameters
);


module.exports.interpolate = function(params) {
  return function(tmpl) {
    return require('mout/string/interpolate')(tmpl, params, /\(([^)]+)\)/g);
  };
};
