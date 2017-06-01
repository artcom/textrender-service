"use strict"

function checkRequirements(requirements, object) {
    requirements = requirements || [];
    object = object || {};
    if(!Array.isArray(requirements) && typeof object !== 'object') {
        return false;
    }
    var objKeys = Object.keys(object);
    return requirements.every(function(thing) { return objKeys.indexOf(thing) > -1 });
}

module.exports = {
    "checkRequirements": checkRequirements,
}