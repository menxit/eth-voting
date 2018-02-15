const app = require('express')();
const { bodyParser, codiceFiscaleItaliano, easyRSA, redis } = require('./factory');
const { port, public_key, private_key } = require('./config');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use('/ping', (req, res) => res.send({ A: 'A' }));

app.post('/api/v1/token', (req, res) => {

  const { body } = req;
  const { cf, encrypted_address } = body;

  if(!cf || !encrypted_address)
    return res.sendStatus(400);

  if(!codiceFiscaleItaliano(cf))
    return res.sendStatus(400);

  const token = easyRSA.encrypt(encrypted_address, private_key);

  redis.getAsync(cf)
    .then(result => {
      if(result) {
        return res.sendStatus(400);
      }
      redis.set(cf.toLowerCase(), token);
      return res.send({ token });
    })
    .catch(error => res.sendStatus(500))

});

app.get('/api/v1/public_key', (req, res) => res.send({ public_key }));

app.post('/api/v1/encrypt', (req, res) => {
  const { body } = req;
  const { plain_text } = body;
  res.send({ encrypted: easyRSA.encrypt(plain_text, public_key) });
});

app.listen(port);
