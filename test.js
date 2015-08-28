var assert = require('assert');
var turbasen = require('.');

process.env.NODE_ENV = 'test';

describe('conf', function() {
  it('sets default config from environment', function() {
    assert.equal(turbasen.conf.API_KEY, process.env.NTB_API_KEY);
    assert.equal(turbasen.conf.API_ENV, process.env.NTB_API_ENV);
    assert.equal(turbasen.conf.USER_AGENT, process.env.NTB_USER_AGENT);
  });
});

describe('configure()', function() {
  afterEach(function() {
    turbasen.configure({
      API_KEY: process.env.NTB_API_KEY,
      API_ENV: process.env.NTB_API_ENV,
      USER_AGENT: process.env.NTB_USER_AGENT
    });
  });

  it('updates conf variables', function() {
    turbasen.configure({
      API_KEY: 'foo',
      API_ENV: 'bar',
      USER_AGENT: 'baz'
    });

    assert.equal(turbasen.conf.API_KEY, 'foo');
    assert.equal(turbasen.conf.API_ENV, 'bar');
    assert.equal(turbasen.conf.USER_AGENT, 'baz');
  });

  it.skip('regenares request object', function() {

  });
});

describe('_requestDefaults()', function() {
  it('returns request object', function() {
    assert.equal(typeof turbasen._requestDefaults(), 'function');
  });
});

describe('api', function() {
  it('exposes data types functions', function() {
    [
      'aktiviteter',
      'bilder',
      'grupper',
      'områder',
      'steder',
      'turer'
    ].forEach(function(type) {
      assert.equal(typeof turbasen[type], 'function');
      assert.equal(typeof turbasen[type].post, 'function');
      assert.equal(typeof turbasen[type].get, 'function');
      assert.equal(typeof turbasen[type].delete, 'function');
      assert.equal(typeof turbasen[type].put, 'function');
      assert.equal(typeof turbasen[type].patch, 'function');
    });
  });
});

describe('near.js', function() {
  it('returns cabins near coornidate', function(done) {
    require('./examples/near').on('data', function(data) {
      assert.equal(data.documents[0].navn, 'Selhamar');
      assert.equal(data.documents[1].navn, 'Åsedalen');
      assert.equal(data.documents[2].navn, 'Torvedalshytta');
      assert.equal(data.documents[3].navn, 'Vatnane');
      assert.equal(data.documents[4].navn, 'Solrenningen');

      done();
    });
  });
});
