"use strict";

var Routes = require('./Router/Router');
var bodyParser = require("./API/BodyParser");
var renderMiddleware = require('./API/RenderMiddleware');
var debug = require("./Utilities/debug")("WebServer");
var app = new Routes();

// smh broken: app.use(Routes.static("./Images"));

app.use(bodyParser);

renderMiddleware(app);

// Default 404 handler.
app.use(function(req, res, next) {
    res.json({status: 404, error: "API Endpoint not found"});
});

app.listen(8080);
debug.log("Listening on Port 8080");