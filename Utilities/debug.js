"use strict";

require("./prototypes")

/**
 * Provides and colorizes a simple console logging system with debug.
 * Already adds logging paths for error, warn, log, debug
 * Builds the logging paths and returns an Object containing the usual
 * print options.
 */
module.exports = function(name) {

    var colorString = "{0}{1}\x1b[0m";
    var red = "\x1b[31m";
    var yellow = "\x1b[33m";
    var green = "\x1b[32m";
    var cyan = "\x1b[36m";
    var bright = "\x1b[1m";
    var blinking = "\x1b[5m";


    return new function() {
        // debug operations

        function colorFormat(color, args, prefix) {
           return prefix + " " + colorString
                .format(
                    color,
                    Array.prototype.slice.call(args).join("; ")
                )
        }
        var prefix = "[ " + name + " ]";

        this.severe = function() { console.error(colorFormat(blinking + bright + red, arguments, prefix))};
        this.error = function() { console.error(colorFormat(red, arguments, prefix))};
        this.warn = function() { console.warn(colorFormat(yellow, arguments, prefix))};
        this.log = function() { console.log(colorFormat(cyan, arguments, prefix))};
        this.debug = function() { console.log(colorFormat(bright + green, arguments, prefix))}; 
    };
};