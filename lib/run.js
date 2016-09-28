var fillIn = require('mout/object/fillIn');


module.exports = function(config) {
  return function(buildNumber, params) {
    params = fillIn({}, normalizeParams(params), {
      'host': 'http://127.0.0.1',
      'port': '8088',
      'context': ''
    });


    var vmParams = []
      .concat(getDefaultVmParams())
      .concat(getBaseUrlParam(params))
      .concat(params['--'] || []);


    runJar(
      (params.jar || getJarPath(config, buildNumber)),
      vmParams,
      getAppParams(params));
  }
};


module.exports.getDefaultVmParams = getDefaultVmParams;


function getDefaultVmParams() {
  return [
    '-Xmx1g',
    '-XX:PermSize=256m',
    '-XX:MaxPermSize=256m',
    '-Djetbrains.youtrack.disableBrowser=true',
    '-Djetbrains.charisma.suckTheTractorDriversDick=true'
  ];
}


function normalizeParams(params) {
  params = params || {};

  return fillIn({}, params, {
    host: params.h,
    port: params.p
  });
}


function getJarPath(config, buildNumber) {
  return require('path').resolve(config.rootDir, String(buildNumber), getJarNameByBuildNumber(buildNumber));
}


function getBaseUrlParam(params) {
  var baseUrl = params.host + ':' + params.port;

  if (params.context) {
    baseUrl += '/' + params.context;
  }

  return '-Djetbrains.youtrack.baseUrl=' + baseUrl
}


function getAppParams(params) {
  return [].concat([
    params.context ? params.port + '/' + params.context : params.port
  ]);
}


function getJarNameByBuildNumber(buildNumber) {
  return 'youtrack-' + buildNumber + '.jar';
}


function runJar(jarPath, vmParams, appParams) {
  var prc = require('child_process').spawn('java', []
    .concat(vmParams || [])
    .concat(['-jar', jarPath])
    .concat(appParams || [])
  );


  prc.stdout.on('data', log);
  prc.stderr.on('data', errorLog);
  prc.on('error', log);
  prc.on('close', log);

  return prc;

  function log(data) {
    console.log(String(data));
  }

  function errorLog(data) {
    console.error(String(data));
  }
}
