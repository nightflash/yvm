var expect = require('expect');
var mock = require('mock-fs');
var fs = require('fs');
var createConfig = require('../lib/config').createConfig;
var createRun = require('../lib/run');
var process = require('child_process');


describe('run', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {
        '2001': {'youtrack-2001.jar': ''},
        '2002': {'youtrack-2002.jar': ''}
      },
      '/tmp': {}
    });
  });


  beforeEach(function() {
    expect.spyOn(process, 'spawn').andReturn(createProcessMock());
  });


  var run;
  beforeEach(function() {
    run = createRun(createConfig({rootDir: '/foo/bar'}));
  });


  it('should run build', function() {
    var buildNumber = '2022';

    run(buildNumber);

    expect(process.spawn.calls[0].arguments).toEqual([
      'java',
      createRun.getDefaultVmParams().concat([
        getBaseUrl(),
        '-jar', getJarPathForBuildNumber(buildNumber),
        getDefaultPort()
      ])
    ]);
  });


  it('should run latest build if we do not pass build number', function() {
    run();

    expect(process.spawn.calls[0].arguments).toEqual([
      'java',
      createRun.getDefaultVmParams().concat([
        getBaseUrl(),
        '-jar', getJarPathForBuildNumber('2002'),
        getDefaultPort()
      ])
    ]);
  });


  it('should run on context', function() {
    var buildNumber = '2022';

    run(buildNumber, {
      context: 'foo'
    });

    expect(process.spawn.calls[0].arguments).toEqual([
      'java',
      createRun.getDefaultVmParams().concat([
        getBaseUrl(null, 'foo'),
        '-jar', getJarPathForBuildNumber(buildNumber),
        getAppParams(null, 'foo')
      ])
    ]);
  });


  it('should run on specific port', function() {
    var buildNumber = '2022';
    var customPort = '9090';

    run(buildNumber, {
      port: customPort
    });

    expect(process.spawn.calls[0].arguments).toEqual([
      'java',
      createRun.getDefaultVmParams().concat([
        getBaseUrl(customPort),
        '-jar', getJarPathForBuildNumber(buildNumber),
        customPort
      ])
    ]);
  });


  it('should allow pass custom jvm parameters', function() {
    var buildNumber = '2022';

    run(buildNumber, {
      '--': ['-Dfoo=foo']
    });

    expect(process.spawn.calls[0].arguments).toEqual([
      'java',
      createRun.getDefaultVmParams().concat([
        getBaseUrl(),
        '-Dfoo=foo',
        '-jar', getJarPathForBuildNumber(buildNumber),
        getDefaultPort()
      ])
    ]);
  });


  it('should allow pass jar path', function() {
    run(null, {jar: '/foo/bar/zoo.jar'});

    expect(process.spawn.calls[0].arguments).toEqual([
      'java',
      createRun.getDefaultVmParams().concat([
        getBaseUrl(),
        '-jar', '/foo/bar/zoo.jar',
        getDefaultPort()
      ])
    ]);
  });


  afterEach(function() {
    mock.restore();
    expect.restoreSpies();
  });


  function createProcessMock() {
    return {
      stdout: {on: expect.createSpy()},
      stderr: {on: expect.createSpy()},
      on: expect.createSpy()
    };
  }


  function getJarPathForBuildNumber(buildNumber) {
    return '/foo/bar/' + buildNumber + '/youtrack-' + buildNumber + '.jar';
  }


  function getBaseUrl(port, context) {
    port = port || getDefaultPort();
    return '-Djetbrains.youtrack.baseUrl=http://127.0.0.1:' + port + (context ? '/' + context : '');
  }

  function getAppParams(port, context) {
    port = port || getDefaultPort();
    return port + ((context ) ? '/' + context : '');
  }


  function getDefaultPort() {
    return '8088'
  }
});
