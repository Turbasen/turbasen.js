'use strict';

const turbasen = require('../');

module.exports = (opts, cb) => {
  const groups = new Map();

  turbasen.grupper.each({ fields: 'status,navn,lenker' }, (group, next) => {
    const cache = {
      navn: group.navn ? group.navn : 'Ukjent Gruppe',
      url: `http://www.ut.no/gruppe/${group._id}`,
    };

    if (group.lenker) {
      for (const u of group.lenker) {
        if (u.type === 'Hjemmeside') {
          cache.url = u.url;
        }
      }
    }

    if (opts.debug || !module.parent) {
      console.log(new Date(), cache);
    }

    groups.set(group._id, cache);

    next();
  }, err => {
    cb(err, groups);
  })
};

if (!module.parent) {
  module.exports({}, (err, groups) => {})
}
