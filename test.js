'use strict';

const assert = require('assert');
const turbasen = require('.');

process.env.NODE_ENV = 'test';

describe('conf', function describe() {
  it('sets default config from environment', function it() {
    assert.equal(turbasen.conf.API_KEY, process.env.NTB_API_KEY);
    assert.equal(turbasen.conf.API_ENV, process.env.NTB_API_ENV);
    assert.equal(turbasen.conf.USER_AGENT, process.env.NTB_USER_AGENT);
  });
});

describe('configure()', function describe() {
  afterEach(function afterEach() {
    turbasen.configure({
      API_KEY: process.env.NTB_API_KEY,
      API_ENV: process.env.NTB_API_ENV,
      USER_AGENT: process.env.NTB_USER_AGENT,
    });
  });

  it('updates conf variables', function it() {
    turbasen.configure({
      API_KEY: 'foo',
      API_ENV: 'bar',
      USER_AGENT: 'baz',
    });

    assert.equal(turbasen.conf.API_KEY, 'foo');
    assert.equal(turbasen.conf.API_ENV, 'bar');
    assert.equal(turbasen.conf.USER_AGENT, 'baz');
  });

  it('regenares request object');
});

describe('_requestDefaults()', function describe() {
  it('returns request object', function it() {
    assert.equal(typeof turbasen._requestDefaults(), 'function');
  });
});

describe('api', function describe() {
  it('exposes data types functions', function it() {
    [
      'aktiviteter',
      'bilder',
      'grupper',
      'områder',
      'steder',
      'turer',
    ].forEach(function forEach(type) {
      assert.equal(typeof turbasen[type], 'function');
      assert.equal(typeof turbasen[type].each, 'function');
      assert.equal(typeof turbasen[type].post, 'function');
      assert.equal(typeof turbasen[type].get, 'function');
      assert.equal(typeof turbasen[type].delete, 'function');
      assert.equal(typeof turbasen[type].put, 'function');
      assert.equal(typeof turbasen[type].patch, 'function');
    });
  });

  it('exposes each document itterator function', function it(done) {
    this.timeout(10000);

    let counter = 0;
    const opts = {
      status: 'Offentlig',
      tags: 'Bretur',
      limit: 10,
    };

    turbasen.turer.each(opts, function eachItem(item, next) {
      counter++;
      process.nextTick(next);
    }, function eachDone(err) {
      assert.ifError(err);
      assert.equal(counter, 30);

      done();
    });
  });
});

describe('near.js', function describe() {
  it('returns cabins near coornidate', function it(done) {
    require('./examples/near').on('data', function on(data) {
      assert.equal(data.documents[0].navn, 'Selhamar');
      assert.equal(data.documents[1].navn, 'Åsedalen');
      assert.equal(data.documents[2].navn, 'Torvedalshytta');
      assert.equal(data.documents[3].navn, 'Vatnane');
      assert.equal(data.documents[4].navn, 'Solrenningen');

      done();
    });
  });
});
