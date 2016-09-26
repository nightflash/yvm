var expect = require('expect');
var mock = require('mock-fs');
var fs = require('fs');
var createConfig = require('../lib/config').createConfig;


describe('rm', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {
        '2001': {
          'youtrack-2001.jar': ''
        },
        '2002': {
          'youtrack-2002.jar': ''
        },
        '2102': {
          'youtrack-2102.jar': ''
        },
        '3000': {
          'youtrack-3000.jar': ''
        }
      }
    });
  });


  var ls;
  var rm;
  beforeEach(function() {
    var config = createConfig({rootDir: '/foo/bar'});
    ls = require('../lib/ls')(config);
    rm = require('../lib/rm')(config);
  });


  it('should remove installed build', function() {
    rm('2001');

    expect(ls()).toEqual(['2002', '2102', '3000']);
  });


  it('should allow remove list of builds', function() {
    rm([
      '2001',
      '2002'
    ]);

    expect(ls()).toEqual([
      '2102',
      '3000'
    ]);
  });


  it('should allow remove builds using mask', function() {
    rm('20*');

    expect(ls()).toEqual(['2102', '3000']);
  });


  it('should remove all builds', function() {
    rm('*');

    expect(ls()).toEqual([]);
  });


  afterEach(function() {
    mock.restore();
  });
});
