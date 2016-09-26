var url = require('url');


function createRequest(resourceName) {
  var req = url.parse(resourceName, true);

  return {
    hostname: req.hostname,
    path: req.path,
    port: req.port || (req.protocol === 'https:' ? '443' : '80'),
    protocol: req.protocol
  };
}


function addHeader(headers) {
  return addPropToRequest({
    headers: headers
  });
}


function addQuery(queryParams) {
  return addPropToRequest({
    query: queryParams
  });
}


function addPath(path) {
  return function(request) {
    return addPropToRequest({
      path: url.resolve(request.path || '', path)
    })(request);
  };
}


function addPropToRequest(props) {
  var merge = require('mout/object/merge');

  return function(request) {
    return merge({}, request, props);
  };
}


module.exports.createRequest = createRequest;
module.exports.addHeader = addHeader;
module.exports.addPath = addPath;
module.exports.addQuery = addQuery;
module.exports.addPropToRequest = addPropToRequest;
module.exports.stringify = function(request) {
  return url.format(addPropToRequest({
    pathname: request.path
  })(request));
};
