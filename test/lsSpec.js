var expect = require('expect');
var mock = require('mock-fs');
var fs = require('fs');
var createConfig = require('../lib/config').createConfig;


describe('ls', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {
        '2001': {
          'youtrack-2001.jar': ''
        },
        '2002': {
          'youtrack-2002.jar': ''
        }
      }
    });
  });


  var ls;
  beforeEach(function() {
    ls = require('../lib/ls')(createConfig({rootDir: '/foo/bar'}));
  });


  it('should return installed builds', function() {
    expect(ls()).toEqual([
      '2002',
      '2001'
    ]);
  });


  it('should sorted builds list', function() {
    expect(ls()).toEqual([
      '2002',
      '2001'
    ]);
  });


  it('should return empty list if directory does not exist', function() {
    ls = require('../lib/ls')(createConfig({rootDir: '/foo/bar/NOT_EXISTED_DIR'}));

    expect(ls()).toEqual([]);
  });


  afterEach(function() {
    mock.restore();
  });
});
