var expect = require('expect');
var mock = require('mock-fs');
var fs = require('fs');
var createConfig = require('../lib/config').createConfig;


describe('install', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {
        '7.0.2001': {'youtrack-7.0.2001.jar': ''},
        '7.0.2002': {'youtrack-7.0.2002.jar': ''}
      },
      '/moo': {'foo.jar': ''}
    });
  });


  var install;
  beforeEach(function() {
    var config = createConfig({
      rootDir: '/foo/bar'
    });

    install = require('../lib/install')(config);
  });


  it('should install build', function() {
    var bundleVersion = '7.0.202';

    install('/moo/foo.jar', {version: bundleVersion});

    expect(fs.existsSync('/foo/bar/' + bundleVersion + '/youtrack-' + bundleVersion + '.jar'))
      .toEqual(true);
  });


  afterEach(function() {
    mock.restore();
  });
});
