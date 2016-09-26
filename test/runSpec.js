var expect = require('expect');
var mock = require('mock-fs');
var fs = require('fs');
var createConfig = require('../lib/config').createConfig;
var createRun = require('../lib/run');


describe('run', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {
        '2001': {
          'youtrack-2001.jar': ''
        },
        '2002': {
          'youtrack-2002.jar': ''
        }
      },
      '/tmp': {}
    });
  });


  var run;
  beforeEach(function() {
    run = createRun(createConfig({rootDir: '/foo/bar'}), createProcessRunnerMock);
  });


  it('should run build', function() {
    run('2022');
  });


  afterEach(function() {
    mock.restore();
  });


  function createProcessRunnerMock() {
    function runProcess() {
      return {
        stdout: {on: expect.createSpy()},
        stderr: {on: expect.createSpy()},
        on: expect.createSpy()
      }
    }


    return runProcess;
  }
});
