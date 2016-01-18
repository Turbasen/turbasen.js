var EE = require('events').EventEmitter;
var turbasen = require('../');

module.exports = new EE();

var query = {
  near: '6.262835993316622,60.91359423190754',
  tags: 'Hytte'
};

turbasen.steder(query, function(err, res, cabins) {
  module.exports.emit('data', cabins);

  if (process.env.NODE_ENV !== 'test') {
    for (var i in cabins.documents) {
      console.log(cabins.documents[i].navn);
    }
  }
});
