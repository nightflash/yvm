var expect = require('expect');
var request = require('../lib/request');
var teamCityRequest = require('../lib/team-city-request');
var compose = require('mout/function/compose');


describe('createBuildListRequest', function() {


  var testRequest;
  beforeEach(function() {
    testRequest = teamCityRequest.createBuildListRequest({});
  });


  it('should create request', function() {
    expect(testRequest.path)
      .toEqual('/guestAuth/app/rest/builds/');
  });


  it('should get only success builds', function() {
    expect(testRequest.query.locator)
      .toMatch('status:SUCCESS');
  });


  it('should get only for specific build type', function() {
    expect(testRequest.query.locator)
      .toMatch('buildType:(buildTypeId)');
  });


  it('should get first 10 builds by default', function() {
    expect(testRequest.query.count)
      .toEqual('10');
  });


  it('should request json by default', function() {
    expectJsonRequest(testRequest);
  });


  it('should interpolate parameters', function() {
    expect(
      compose(
        teamCityRequest.interpolate({buildTypeId: 'foo'}),
        request.stringify
      )(testRequest)
    ).toMatch('buildType%3Afoo');
  });
});


describe('createBuildArtifactRequest', function() {


  var testRequest;
  beforeEach(function() {
    testRequest = teamCityRequest.createBuildArtifactRequest({});
  });


  it('should create request', function() {
    expect(testRequest.path)
      .toEqual('/guestAuth/app/rest/builds/buildType:(buildTypeId),number:(buildNumber)/artifacts/content/(artifactName)');
  });


  it('should request json by default', function() {
    expectJsonRequest(testRequest);
  });


  it('should interpolate parameters', function() {
    expect(
      compose(
        teamCityRequest.interpolate({buildTypeId: 'foo', buildNumber: '2222'}),
        request.stringify
      )(testRequest)
    ).toMatch('2222');
  });
});


function expectJsonRequest(testRequest) {
  expect(testRequest.headers.Accept)
    .toEqual('application/json');
}


