var expect = require('expect');
var request = require('../lib/request');


describe('request', function() {


  var fooRequest;
  beforeEach(function() {
    fooRequest = request.createRequest('http://foo.com:8088');
  });


  describe('createRequest', function() {
    it('should create request object', function() {
      expect(fooRequest)
        .toEqual({
          hostname: 'foo.com',
          path: '/',
          port: '8088',
          protocol: 'http:'
        });
    });


    it('should set default http port', function() {
      expect(request.createRequest('http://foo.com').port).toEqual('80');
    });


    it('should set default https port', function() {
      expect(request.createRequest('https://foo.com').port).toEqual('443');
    });
  });


  describe('addHeader', function() {
    it('should add header to request', function() {
      var addJsonHeader = request.addHeader({
        'Accept': 'application/json'
      });

      expect(addJsonHeader(fooRequest).headers.Accept)
        .toEqual('application/json');
    });
  });


  describe('addPath', function() {
    it('should add path to request', function() {
      var addBarPath = request.addPath('bar');

      expect(addBarPath(fooRequest).path)
        .toEqual('/bar');
    });


    it('should allow compose paths', function() {
      var addBarPath = request.addPath('bar/');
      var addZooPath = request.addPath('zoo');

      expect(addZooPath(
        addBarPath(fooRequest)
      ).path).toEqual('/bar/zoo');
    });
  });


  describe('addQuery', function() {
    it('should allow add any prop to request object', function() {
      var requestWithBarQuery = request.addQuery({bar: 'bar'})(fooRequest);

      expect(requestWithBarQuery.query).toEqual({bar: 'bar'});
    });


    it('should allow compose query functions', function() {
      var addBarQuery = request.addQuery({bar: 'bar'});
      var addZooQuery = request.addQuery({zoo: 'zoo'});

      expect(
        addZooQuery(addBarQuery(fooRequest)).query
      ).toEqual({bar: 'bar', zoo: 'zoo'});
    });
  });


  describe('stringify', function() {
    it('should convert request to string', function() {
      expect(request.stringify(fooRequest))
        .toEqual('http://foo.com:8088/');
    });


    it('should convert request with path to string', function() {
      expect(request.stringify(request.addPath('bar')(fooRequest)))
        .toEqual('http://foo.com:8088/bar');
    });


    it('should convert request with query to string', function() {
      expect(request.stringify(request.addQuery({
        bar: 'bar'
      })(fooRequest))).toEqual('http://foo.com:8088/?bar=bar');
    });
  });
});


