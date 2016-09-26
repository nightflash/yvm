var compose = require('mout/function/compose');
var oboe = require('oboe');
var tcRequest = require('../lib/team-city-request');
var request = require('../lib/request');
var printBuildNumber = require('../lib/print-build-number').printBuildNumber;


module.exports = function(params, onDone) {
  onDone = onDone || require('mout/function/identity');


  var buildListRequest = compose(
    request.addQuery({count: params.count || 10}),
    tcRequest.createBuildListRequest
  )(tcRequest.createRequest(params.hostname));


  var requestUrl = compose(
    tcRequest.interpolate({buildTypeId: params.buildTypeId}),
    request.stringify
  )(buildListRequest);


  return oboe({
    url: requestUrl,
    headers: buildListRequest.headers
  }).on('done', onDone.bind(null, null)).fail(onDone).node('!build.*', printBuild);


  function printBuild(build) {
    printBuildNumber(false, build.number);
  }
};
