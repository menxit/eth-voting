const app = require('express')();
const { port, public_key, private_key } = require('./config');
const { bodyParser, easyRSA, aWebAPI, redis } = require('./factory');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use('/ping', (req, res) => res.send({ B: 'B' }));

app.post('/api/v1/signup', (req, res) => {
  const { token } = req.body;
  aWebAPI.get('public_key')
    .then(result => {
      let confirmed = easyRSA.decrypt(token, result.public_key);
      confirmed = easyRSA.decrypt(confirmed, private_key);

      redis.set(confirmed, token);
      return res.send({ confirmed });
    })
    .catch(error => res.send({ error }));
});

app.get('/api/v1/valid_address', (req, res) => {
  redis.keys('*', (err, keys) => {
    res.send(keys);
  });
});

app.get('/api/v1/public_key', (req, res) => res.send({ public_key }));

app.post('/api/v1/encrypt', (req, res) => {
  const { body } = req;
  const { plain_text } = body;
  res.send({ encrypted: easyRSA.encrypt(plain_text, public_key) });
});


app.listen(port);
