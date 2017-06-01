var Routes = require('../Router/Router');
var app = new Routes();

app
  .get('/', function(req, res, next) {
      res.json({message: 'This is a get router.'});
  })
  .post('/', function(req, res, next) {
      res.json({message: 'This is a special post router.'});
  })
  .all('/', function(req, res, next) {
    res.json({message: 'You might try GET or POST.'});
  });
app.listen(8080);
console.log('Server started on Port 8080.');