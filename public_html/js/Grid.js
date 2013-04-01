/*global validateArgs*/

function Grid(args) {
    "use strict";
    args = args || {};
    validateArgs(args, ["width", "height", "canvas"]);
    var w = args.width,
        h = args.height,
        s = args.cellSize,
        p = args.cellPadding,
        canvas = args.canvas,
        colors = {
            live: ["#1E6823", "#44A340", "#8CC665"],
            dead: "#EEE"
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
        var x, y;
        array = array || [false];
        for (x = 0; x < w; x += 1) {
            for (y = 0; y < h; y += 1) {
                drawCell(x, y, array[x * h + y]);
            }
        }
    }

    return {
        inspect: function () {
            console.log(w, h);
        },
        draw: function (array) {
            if (array.length !== w * h) { throw new Error("Wrong size data."); }
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


