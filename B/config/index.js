const config = {
  common: require('./common'),
  development: require('./development'),
  production: require('./production'),
};

module.exports = Object.assign({}, config.common, config[process.env.NODE_ENV || 'development']);
