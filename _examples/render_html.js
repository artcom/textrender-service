var Routes = require('../Router/Router');
var bodyParser = require("../API/BodyParser");
var app = new Routes();

app
  .use(bodyParser)
  .post(/.*/, function(req, res, next) { // _all_ post requests
    // required this way for parallel requests! :(
    var webPage = require('webpage'); 
    var page = webPage.create();
    // fill the dom: 
    page.content = req.body.html;
    var imageData = window.atob(page.renderBase64('PNG'));
    res.header('Content-Type', 'image/png');
    res.header('Content-Length', imageData.length);
    res.sendBinary(imageData);
  });
app.listen(8080);
console.log('Server started on Port 8080.');