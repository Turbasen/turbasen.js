'use strict';

const eachAsync = require('async-each-series');

module.exports.conf = {
  API_KEY: process.env.NTB_API_KEY,
  API_ENV: process.env.NTB_API_ENV || 'api',
  USER_AGENT: process.env.NTB_USER_AGENT || require('./package.json').version,
};

module.exports._requestDefaults = function reqestDefaults() {
  return require('request').defaults({
    baseUrl: 'http://' + module.exports.conf.API_ENV + '.nasjonalturbase.no/',
    headers: {
      'user-agent': module.exports.conf.USER_AGENT,
    },
    json: true,
    qs: {
      api_key: module.exports.conf.API_KEY,
    },
  });
};

let request = module.exports._requestDefaults();

[
  'aktiviteter',
  'bilder',
  'grupper',
  'områder',
  'steder',
  'turer',
].forEach(function typeForEach(type) {
  module.exports[type] = function typeAll(params, callback) {
    if (!callback) { return request.get({ url: encodeURIComponent(type), qs: params }); }
    request.get({ url: encodeURIComponent(type), qs: params }, callback);
  };

  module.exports[type].each = function typeEach(params, callback, done) {
    const query = params;

    query.skip = query.skip || 0;
    query.limit = query.limit || 50;

    module.exports[type](query, function typeCb(typeErr, res, body) {
      if (typeErr) { return done(typeErr); }

      eachAsync(body.documents, callback, function eachAsyncDone(eachErr) {
        if (eachErr) { return done(eachErr); }

        if (body.documents < query.limit) {
          return done(null);
        }

        query.skip += query.limit;
        module.exports[type].each(query, callback, done);
      });
    });
  };

  module.exports[type].post = function typePost(data, callback) {
    if (!callback) {
      return request.post({ url: encodeURIComponent(type), body: data });
    }

    request.post({ url: encodeURIComponent(type), body: data }, callback);
  };

  module.exports[type].get = function typeGet(id, callback) {
    if (!callback) {
      return request.get({ url: encodeURIComponent(type) + '/' + id });
    }

    request.get({ url: encodeURIComponent(type) + '/' + id }, callback);
  };

  module.exports[type].delete = function typeDelete(id, callback) {
    if (!callback) {
      return request.del({ url: encodeURIComponent(type) + '/' + id });
    }

    request.del({ url: encodeURIComponent(type) + '/' + id }, callback);
  };

  module.exports[type].put = function typePut(id, data, callback) {
    if (!callback) {
      return request.put({ url: encodeURIComponent(type) + '/' + id, body: data });
    }

    request.put({ url: encodeURIComponent(type) + '/' + id, body: data }, callback);
  };

  module.exports[type].patch = function typePatch(id, data, callback) {
    if (!callback) {
      return request.patch({ url: encodeURIComponent(type) + '/' + id, body: data });
    }

    request.patch({ url: encodeURIComponent(type) + '/' + id, body: data }, callback);
  };
});

module.exports.configure = function configure(obj) {
  Object.keys(obj).forEach(function objKeysForEach(key) {
    module.exports.conf[key] = obj[key];
  });

  // Generate a new request object
  request = module.exports._requestDefaults();
};
