var expect = require('expect');
var createConfig = require('../lib/config').createConfig;


describe('config', function() {
  it('should set rootDir to config', function() {
    var config = createConfig({rootDir: 'foo'});

    expect(config.rootDir).toEqual('foo');
  });


  it('should set default rootDir if we do not pass explicitly', function() {
    var processEnv = {HOME: '/bar'};
    var config = createConfig({}, processEnv);

    expect(config.rootDir).toEqual('/bar/.youtrack/builds');
  });


  it('should allow create config from existing config', function() {
    var config = createConfig({
      foo: 'foo'
    });


    var newConfig = config.create({
      bar: 'bar'
    });


    expect(newConfig.foo).toEqual('foo');
    expect(newConfig.bar).toEqual('bar');
  });
});
