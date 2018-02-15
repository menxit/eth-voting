const { hostA, redis } = require('./config');
const Promise = require('bluebird');

module.exports = {
  bodyParser: require('body-parser'),
  easyRSA: require('menxit-easy-rsa'),
  aWebAPI: (function() {
    const WebAPI = require('menxapi');
    return new WebAPI(`${hostA}/api/v1`);
  })(),
  redis: (function() {
    const r = require('redis');
    Promise.promisifyAll(r.RedisClient.prototype);
    Promise.promisifyAll(r.Multi.prototype);
    return r.createClient({ host: redis.host, port: redis.port });
  })(),
};
