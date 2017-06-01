"use strict";
var debug = require("../Utilities/debug")("Router");

var httpMethods = [
    'get',
    'post',
    'put',
    'head',
    'delete',
];

var Routes = (function() {
	var _ = {}, ctor = function(){};
	_.bind = function bind(func, context) {
		var bound, args, slice = Array.prototype.slice;
		args = slice.call(arguments, 2);
		return bound = function() {
			if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
			ctor.prototype = func.prototype;
			var self = new ctor;
			var result = func.apply(self, args.concat(slice.call(arguments)));
			if (Object(result) === result) return result;
			return self;
		};
	};
	
	var Res = function Res(res) {
		this.headers = res.headers || {};
		this.res = res;
		this.statusCode = res.statusCode;
	};
	Res.prototype.header = function(h, v) {
		if (v) return this.headers[h] = v;
		else return this.headers[h];
	};
	Res.prototype.send = function(body) {
		if (arguments.length == 2) {
			if (typeof body != 'number' && typeof arguments[1] == 'number') {
				this.statusCode = arguments[1];
			} else {
				this.statusCode = body;
				body = arguments[1];
			}
		}

		if (typeof body == 'number') { this.statusCode = body; body = ''; }
		else if (typeof body == 'object') {
            return this.json(body);
        }
		this.close(body);

		return this;
	};
    Res.prototype.sendBinary = function(data) {
        this.res.setEncoding("binary");
        this.close(data);
        return this;
    }
    Res.prototype.json = function(data) {
        this.header("Content-Type", "application/json; encoding=utf-8")
        this.close(JSON.stringify(data));
    }
	Res.prototype.write = function(data) {
		this.res.write(data);
		return this;
	};
	Res.prototype.redirect = function(url) {
		this.header('Location', url);
		this.send(301);
	};
	Res.prototype.close = function(data) {
		this.res.statusCode = this.statusCode;
		this.res.headers = this.headers || {};
		this.write(data);
		this.res.close();
		return this;
	};
	var R = function Routes() {
		this.server = require('webserver').create();
		this.routes = [];
	};
	R.prototype.preRoute = function(req, res) {
		this.router.call(this, req, new Res(res));
	};
	R.prototype.router = function(req, res, i) {
		var i = i || 0;

		for (i; i < this.routes.length; i++) {
			var route = this.routes[i];
			if (route.method == 'ALL' || route.method == req.method) {
				var match = req.url.match(route.route);
				if (match) {
					req.params = match.slice(1);
					try {
						return route.handler.call(this, req, res, _.bind(this.router, this, req, res, ++i));
					} catch (err) {
						debug.error(err.stack);
						return res.send(err.stack, 500);
					}
				}
			}
		}

		res.send('Not found', 404);
	};
	R.prototype.addRoute = function(method, route, handler) {
		if (!(route instanceof RegExp)) route = new RegExp("^" + route + "$");
		this.routes.push({method: method, route: route, handler: handler});
	};
    httpMethods.concat('all').forEach(function(method) {
        var upperCase = method.toUpperCase();
        R.prototype[method] = function(route, handler) {
            this.addRoute(upperCase, route, handler);
			return this;
        }
    });
	R.prototype.use = function(handler) {
		this.addRoute('ALL', /.+/, handler);
		return this;
	};
	R.prototype.listen = function(port) {
		this.server.listen(port, _.bind(this.preRoute, this));
	};

	R.static = function(root) {
		var fs = require('fs'),
			root = fs.absolute(root);

		return function(req, res, next) {
			if (req.method !== 'GET') return next();

			var resource = req.url.slice(1),
				path = root + '/' + resource;

			if (resource && fs.isFile(path) && fs.isReadable(path)) {
				var file = fs.read(path);
				res.send(file);
			} else {
				next();
			}
		}
	};

	return R;
})();

if (module && module.exports) module.exports = Routes;