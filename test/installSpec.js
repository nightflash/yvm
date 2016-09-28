var expect = require('expect');
var mock = require('mock-fs');
var fs = require('fs');
var createConfig = require('../lib/config').createConfig;


describe('install', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {
        '2001': {'youtrack-2001.jar': ''},
        '2002': {'youtrack-2002.jar': ''}
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
    var bundleVersion = '202';

    install('/moo/foo.jar', {version: bundleVersion});

    expect(fs.existsSync('/foo/bar/' + bundleVersion + '/youtrack-' + bundleVersion + '.jar'))
      .toEqual(true);
  });


  afterEach(function() {
    mock.restore();
  });
});
