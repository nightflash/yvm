var compose = require('mout/function/compose');
var oboe = require('oboe');
var tcRequest = require('../lib/team-city-request');
var request = require('../lib/request');
var printBuildNumber = require('../lib/print-build-number').printBuildNumber;
var ls = require('./ls');


module.exports = function(params, onDone) {
  onDone = onDone || require('mout/function/identity');

  var localBuilds = params.markInstalled ? ls(params)() : [];

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
    if (localBuilds.indexOf(build.number) > -1) {
      printBuildNumber(true, build.number);
      return;
    }

    printBuildNumber(false, build.number);
  }
};
