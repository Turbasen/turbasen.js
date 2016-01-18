var EE = require('events').EventEmitter;
var turbasen = require('../');

module.exports = new EE();

var query = {
  status: 'Offentlig',
  navn: '~201',
  fields: 'navn',
};

turbasen.turer.each(query, (tur, next) => {
  if (!/(moh|m.o.h)/i.test(tur.navn)) {
    module.exports.emit('data', tur);

    if (!module.parent) {
      console.log('http://www.ut.no/tur/' + tur._id, tur.navn);
    }
  }

  next();
}, err => {
  if (err) { throw err; }

  module.exports.emit('done');

  if (!module.parent) {
    console.log('Done!');
  }
});
