/* jshint unused:false */
/* global validateArgs:false  */

function Game (props) {
    "use strict";
    validateArgs(props, ["width", "height"], "Game");

    return {
        init: function (data) {
               
        },
        step: function () {
            //return data;
        }
    };
}

