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
  var jarArtifactName;
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

    jarArtifactName = 'youtrack-9.999.jar'

    var teamCityHostMock = 'http://foo.com';

    this.serverBuildArtifactsMock = nock(teamCityHostMock)
      .get('/guestAuth/app/rest/builds/buildType:' + buildTypeId + ',number:' + buildNumber + '/artifacts');
    this.serverBuildArtifactsMock.reply(200, createBuildArtifactsResponse(jarArtifactName), {
      'Content-Type': 'application/json'
    });

    this.serverBuildArtifactMock = nock(teamCityHostMock)
      .get('/guestAuth/app/rest/builds/buildType:' + buildTypeId + ',number:' + buildNumber + '/artifacts/content/' + jarArtifactName);
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


function createBuildArtifactsResponse(jarArtifactName) {
  return {
    'count': 4,
    'file': [{
      'name': 'component-versions.txt'
    }, {
      'name': jarArtifactName,
    }, {
      'name': 'youtrack-7.0.29938.war'
    }, {
      'name': 'youtrack-hosted-7.0.29938.zip'
    }]
  };
}

function createBuildArtifactResponse() {
  return '011101';
}
