/*global validateArgs */

function Solver(args) {
    "use strict";
    args = args || {};
    var data,
        tempData,
        steps = 0,
        initialized;

    validateArgs(args, ["height", "width", "data"], "Solver");

    return {
        step: function () {
            //TODO return data, and steps
        }
    };
}

