/*global validateArgs */

function Solver(props) {
    "use strict";
    var data,
        tempData,
        steps = 0,
        initialized;

    validateArgs(props, ["width", "height", "data"], "Game");

    return {
        step: function () {
            //TODO return data, and steps
        }
    };
}

