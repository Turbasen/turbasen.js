'use strict';

const eachAsync = require('async-each-map');

module.exports.conf = {
  API_KEY: process.env.NTB_API_KEY,
  API_ENV: process.env.NTB_API_ENV || 'api',
  USER_AGENT: process.env.NTB_USER_AGENT || require('./package.json').version,
};

module.exports._requestDefaults = function reqestDefaults() {
  return require('request').defaults({
    baseUrl: `http://${module.exports.conf.API_ENV}.nasjonalturbase.no/`,
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
    query.sort = query.sort || '_id';

    const noSkip = !!query.__no_skip__;
    delete query.__no_skip__;

    module.exports[type](query, function typeCb(typeErr, res, body) {
      if (typeErr) { return done(typeErr); }

      eachAsync(body.documents, callback, function eachAsyncDone(eachErr) {
        if (eachErr) { return done(eachErr); }

        if (body.documents < query.limit) {
          return done(null);
        }

        if (!noSkip) {
          query.skip += query.limit;
        }

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
      return request.get({ url: `${encodeURIComponent(type)}/${id}` });
    }

    request.get({ url: `${encodeURIComponent(type)}/${id}` }, callback);
  };

  module.exports[type].delete = function typeDelete(id, callback) {
    if (!callback) {
      return request.del({ url: `${encodeURIComponent(type)}/${id}` });
    }

    request.del({ url: `${encodeURIComponent(type)}/${id}` }, callback);
  };

  module.exports[type].put = function typePut(id, data, callback) {
    if (!callback) {
      return request.put({ url: `${encodeURIComponent(type)}/${id}`, body: data });
    }

    request.put({ url: `${encodeURIComponent(type)}/${id}`, body: data }, callback);
  };

  module.exports[type].patch = function typePatch(id, data, callback) {
    if (!callback) {
      return request.patch({ url: `${encodeURIComponent(type)}/${id}`, body: data });
    }

    request.patch({ url: `${encodeURIComponent(type)}/${id}`, body: data }, callback);
  };
});

module.exports.configure = function configure(obj) {
  Object.keys(obj).forEach(function objKeysForEach(key) {
    module.exports.conf[key] = obj[key];
  });

  // Generate a new request object
  request = module.exports._requestDefaults();
};

module.exports.util = {};

module.exports.util.attribution = function navngiving(type, doc, authors, license) {
  const licenses = new Map([
    ['CC BY 4.0', 'http://creativecommons.org/licenses/by/4.0/deed.no'],
    ['CC BY-SA 4.0', 'http://creativecommons.org/licenses/by-sa/4.0/deed.no'],
    ['CC BY-ND 4.0', 'http://creativecommons.org/licenses/by-nd/4.0/deed.no'],
    ['CC BY-NC 4.0', 'http://creativecommons.org/licenses/by-nc/4.0/deed.no'],
    ['CC BY-NC-SA 4.0', 'http://creativecommons.org/licenses/by-nc-sa/4.0/deed.no'],
    ['CC BY-NC-ND 4.0', 'http://creativecommons.org/licenses/by-nc-nd/4.0/deed.no'],
  ]);

  const docName = doc.navn ? doc.navn : 'Uten Navn';
  const docUrl = `http://www.ut.no/${type}/${doc._id}/`;

  let attribution = `"<a href="${docUrl}">${docName}</a>" av `;

  if (authors && authors instanceof Array) {
    attribution = attribution + authors.reduce((prev, author, i, a) => {
      let delim;

      if (prev) {
        delim = i < a.length - 1 ? ', ' : ' og ';
      } else {
        delim = '';
      }

      if (author.url) {
        return `${prev}${delim}<a href="${author.url}">${author.navn}</a>`;
      }

      return prev + delim + author.navn;
    }, '');
  } else if (typeof authors === 'string') {
    attribution = attribution + authors;
  } else {
    attribution = `${attribution}Ukjent`;
  }

  if (licenses.has(license)) {
    return `${attribution} er lisensiert under <a href="${licenses.get(license)}">${license}</a>.`;
  }

  return `${attribution} er lisensiert under ${license}.`;
};
