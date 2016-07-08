var EE = require('events').EventEmitter;
var turbasen = require('../');

module.exports = new EE();

var query = {
  grupper: '!',
  fields: 'privat',
  'privat.opprettet_av.epost': '~kommune',
};

turbasen.turer.each(query, function each(tur, next) {
  module.exports.emit('data', tur);

  if (!module.parent) {
    var url = `http://www.ut.no/tur/${tur._id}`;

    if (tur.privat.opprettet_av && tur.privat.opprettet_av.epost) {
      console.log(url, tur.privat.opprettet_av.epost);
    }

    if (tur.privat.endret_av && tur.privat.endret_av.epost
      && tur.privat.endret_av.epost !== tur.privat.opprettet_av.epost
    ) {
      console.log(url, tur.privat.endret_av.epost);
    }
  }

  process.nextTick(next);
}, function done(err) {
  module.exports.emit('done', err);
});
