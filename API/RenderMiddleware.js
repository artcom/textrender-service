"use strict"

var Router = require('./../Router/Router');
var util = require('./../Utilities/util.js');
var fs = require("fs");
var debug = require("../Utilities/debug")("Render");
var router = new Router();
var counter = Math.round(Math.random() * 5000);

var HTML_FORMAT = "<!DOCTYPE html><html><head>{0}<style>{1}</style></head><body>{2}</body><style>{3}</style></html>"

var preCheck = function(req, res, next, fields) {
    if(req.body === undefined) {
        return res.json({status:400, error: "No HTTP body"});
    }
    if(!util.checkRequirements(fields, req.body)) {
        return res.json({status: 400, error: "Not enough request parameters"});
    }
    next();
}

var htmlPreChecks = function(req, res, next) {
    preCheck(req, res, next, ['html', 'width', 'height']);
}

var templatePreChecks = function(req, res, next) {
    preCheck(req, res, next, ['content', 'type', 'width', 'height']);
}

var urlPreChecks = function(req, res, next) {
    preCheck(req, res, next, ['url', 'width', 'height']);
}



/**
 * Provides a unique webpage set up with height/width
 * @param req {requestObject} 
 * @return Page
 */
var providePage = function(req) {
    var webPage = require('webpage');
    var page = webPage.create();
    var pageWidth = parseInt(req.body.width);
    var pageHeight = parseInt(req.body.height);
    page.viewportSize = { width: pageWidth, height: pageHeight };
    if(req.body["autoSize"] !== undefined && req.body["autoSize"] === false) {
        debug.warn("Setting clip rect");
        page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
    }
    return page;
}

var setFixedSize = function(page, req) {
    if(req.body["fixedWidth"] === undefined || req.body["fixedWidth"] === false) {
        return;
    }

    debug.warn("Setting fixed width sizes");
    // fix the width by overwriting the document width
    page.evaluate(function(width) {
        var htmlElement = document.getElementsByTagName("html")[0];
        htmlElement.style.overflow = "hidden";
        htmlElement.style.width = width;
        htmlElement.style.maxWidth = width;
        
        document.body.style.overflow = "hidden";
        document.body.style.width = width;
        document.body.style.maxWidth = width;
    }, page.viewportSize.width + "px");
}

var urlRenderCommon = function(req, callback) {
    var page = providePage(req);
    page.open(req.body.url, function(status) {
        if(status !== "success") {
            return debug.error("render status unexepectedly: " + status)
        }
        setFixedSize(page, req);
        callback(page);
    });
}

var templateRenderCommon = function(req, callback) {
    var page = providePage(req);
    debug.debug('file://' + fs.absolute('public/index.html'));
    page.open('file://' + fs.absolute('public/index.html'), function(status) {
        if(status !== "success") {
            return debug.error("render status unexpectedly: " + status)
        }
        page.evaluate(function(type, content) {
            document.setContent(type, content)
        }, req.body.type, req.body.content);
        setFixedSize(page, req);
        
        
        setTimeout(callback, 25, page);
    });
}

var htmlRenderCommon = function(req, callback) {
    var page = providePage(req);
    var css, header;
    req.body["header"] !== undefined ? header = req.body["header"] : header = "";
    req.body["css"] !== undefined ? css = req.body["css"] : css = "";
    page.content = HTML_FORMAT.format(header, css, req.body.html);
    setFixedSize(page, req);
    callback(page);
}

var urlRenderImage = function(req, res, next) {
    urlRenderCommon(req, 
        function(page) {
            var imageData = window.atob(page.renderBase64("PNG"));
            res.header("Content-Type", "image/png");
            res.header("Content-Length", imageData.length);
            res.sendBinary(imageData);
        }
    );
}

var htmlRender = function(req, res, next) {
    htmlRenderCommon(req, function(page) {
        var filename = "image_" + counter + ".png";
        counter++;
        page.render(filename);
        res.json({status: 200, message: "Rendering finished", filename: filename});
    });
};

var htmlRenderImage = function(req, res, next) {
    htmlRenderCommon(req, function(page) {
        var imageData = window.atob(page.renderBase64("PNG"));
        res.header("Content-Type", "image/png");
        res.header("Content-Length", imageData.length);
        res.sendBinary(imageData);
    });
}


var templateRender = function(req, res, next) {
    templateRenderCommon(req, function(page) {
        var filename = "image_" + counter + ".png";
        counter ++;
        page.render(filename);
        res.json({status: 200, message: "Rendering finished", filename: filename});
    });
}

var templateRenderImage = function(req, res, next) {
    templateRenderCommon(req, function(page) {
        var imageData = window.atob(page.renderBase64("PNG"));
        res.header("Content-Type", "image/png");
        res.header("Content-Length", imageData.length);
        res.sendBinary(imageData);
    });
}

var urlRender = function(req, res, next) {
    urlRenderCommon(
        req,
        function(page) {
            var filename = "image_" + counter + ".png";
            counter++;
            page.render(filename);
            res.json({status: 200, message: "Rendering finished", filename: filename});
        }
    );
}

module.exports = function(app) {
    app.post(/render\/html.*/, htmlPreChecks);
    app.post(/render\/template.*/, templatePreChecks);
    app.post(/render\/url.*/, urlPreChecks);
    app.post("/render/html", htmlRender);
    app.post("/render/html/image", htmlRenderImage);
    app.post("/render/url", urlRender);
    app.post("/render/url/image", urlRenderImage);
    app.post("/render/template/image", templateRenderImage);
    app.post("/render/template", templateRender);
}