/* jshint unused:false */
/* global validateArgs:false  */

function validateArgs(given, expected, what) {
    "use strict";
    var missing = [];
    for (var i = 0; i < expected.length; i++) {
        if (!given[expected[i]]) {
            missing.push(expected[i]);
        }
    }
    if (missing.length > 0) {
        var error = "Missing argument(s)";
        if (what) { error += " for " + what; }
        error += ": " + String(missing);
        throw new Error(error);
    }
}

function Grid (args) {
    "use strict";
    args = args || {};
    validateArgs(args, ["width", "height", "canvas"]);
    var w = args.width,
        h = args.height,
        s = args.cellSize,
        p = args.cellPadding,
        canvas = args.canvas,
        colors = {
            "live": "#1E6823,#44A340,#8CC665".split(','),
            "dead": "#EEE"
        };

    // Randomly selects one of the greens.
    function getLiveColor() {
        return colors.live[Math.floor(Math.random() * colors.live.length)];
    }

    function drawCell(x, y, alive) {
        // Get the appropriate color,
        canvas.fillStyle = alive ? getLiveColor() : colors.dead;
        // and draw the cell.
        canvas.fillRect(x * (s + p), y * (s + p), s, s);
    }

    function drawGrid(array) {
        array = array || false;
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                drawCell(x, y, array ? array[x * w + y] : false);
            }
        }
   
    }

    return {
        inspect: function () {
            console.log(w, h);
        },
        draw: function (array) {
            if (array.length !== w * h) { throw "Wrong size data."; } 
            drawGrid(array);
        },
        clear: function () {
            drawGrid(); 
        },
        getWidth: function () {
            return w; 
        },
        getHeight: function () {
            return h; 
        }
    };
}


