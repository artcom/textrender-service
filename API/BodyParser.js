"use strict"

var debug = require("../Utilities/debug")("BodyParser");


module.exports = function(req, res, next){
    var contentType = Object
        .keys(req.headers)
        .filter(function(thing) {
            return thing.toLowerCase() === "content-type";
        });
    
    if(contentType.length > 0 && req.post && req.headers[contentType[0]].toLowerCase().indexOf("json") > -1) {
        
        try {
            req.body = JSON.parse(req.post);
        } catch(err) {
            debug.warn("The request body contained malformed json data.");
        }
        debug.debug("Request Body contains json.");
    } 
    next();
};