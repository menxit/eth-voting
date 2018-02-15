const { hostA, hostB } = require('./config');

module.exports = {

  aClient: (function() {
    const WebAPI = require('menxapi');
    return new WebAPI(`${hostA}/api/v1`);
  })(),

  bClient: (function() {
    const WebAPI = require('menxapi');
    return new WebAPI(`${hostB}/api/v1`);
  })(),

};
