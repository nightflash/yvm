var expect = require('expect');
var nock = require('nock');
var mock = require('mock-fs');
var installRemote = require('../lib/install-remote');
var createConfig = require('../lib/config').createConfig;


nock.back.setMode('record');


describe('install-remote', function() {
  beforeEach(function() {
    mock({
      '/foo/bar': {},
      '/tmp': {}
    });
  });


  afterEach(function() {
    mock.restore();
  });


  var buildTypeId = 'foo';
  var installParams;
  var buildNumber;
  var config;
  beforeEach(function() {
    nock.disableNetConnect();
    config = createConfig({
      rootDir: '/foo/bar'
    });

    buildNumber = '27214';
    installParams = config.create({
      hostname: 'http://foo.com',
      buildTypeId: buildTypeId,
      buildNumber: buildNumber
    });

    this.serverBuildArtifactMock = nock('http://foo.com')
      .get('/guestAuth/app/rest/builds/buildType:' + buildTypeId + ',number:' + buildNumber + '/artifacts/content/youtrack-' + buildNumber + '.jar');

    this.serverBuildArtifactMock.reply(200, createBuildArtifactResponse(), {
      'Accept-Ranges': 'bytes',
      'Content-Type': 'application/java-archive'
    });
  });


  it('should download jar from the server', function(done) {
    installRemote(installParams, done);
  });


  it('should save jar to the file', function(done) {
    installRemote(installParams, (error, file) => {
      expect(file.path).toExist();
      done()
    });
  });
});


function createBuildArtifactResponse() {
  return '011101';
}
