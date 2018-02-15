const { hostB, redis } = require('./config');
const Promise = require('bluebird');

module.exports = {
  bodyParser: require('body-parser'),
  codiceFiscaleItaliano: require('codice-fiscale-italiano'),
  easyRSA: require('menxit-easy-rsa'),
  redis: (function() {
    const r = require('redis');
    Promise.promisifyAll(r.RedisClient.prototype);
    Promise.promisifyAll(r.Multi.prototype);
    return r.createClient({ host: redis.host, port: redis.port });
  })(),
};
