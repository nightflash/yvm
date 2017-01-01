var expect = require('expect');
var nock = require('nock');
var lsRemote = require('../lib/ls-remote');


nock.back.setMode('record');


describe('ls-remote', function() {


  beforeEach(function() {
    expect.spyOn(console, 'log');
  });


  var buildTypeId;
  var tcHostName;
  beforeEach(function() {
    buildTypeId = 'foo';
    tcHostName = 'http://foo.com';

    nock.disableNetConnect();

    this.buildsLocator = 'status:SUCCESS,buildType:' + buildTypeId;
    this.serverBuildArtifactMock = nock(tcHostName)
      .get('/guestAuth/app/rest/builds/');
  });


  it('should request list of builds', function(done) {
    this.serverBuildArtifactMock.query({
      locator: this.buildsLocator,
      count: '10'
    }).reply(200, createBuildListResponse());


    lsRemote({
      hostname: tcHostName,
      buildTypeId: buildTypeId
    }, done);
  });


  it('should allow pass count how much builds print', function(done) {
    this.serverBuildArtifactMock.query({
      locator: this.buildsLocator,
      count: '20'
    }).reply(200, createBuildListResponse());


    lsRemote({
      hostname: tcHostName,
      buildTypeId: buildTypeId,
      count: 20
    }, done);
  });


  afterEach(function() {
    expect.restoreSpies();
  });
});


function createBuildListResponse() {
  return JSON.stringify({
    'count': 1,
    'build': [createBuildMock()]
  });
}


function createBuildMock() {
  return {
    'id': 12979046,
    'number': '27214',
    'status': 'SUCCESS',
    'branchName': 'refs/heads/develop',
    'href': '',
    'webUrl': ''
  }
}
