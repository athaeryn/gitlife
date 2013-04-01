/*jslint unused: false */
/*global validateArgs */
function Solver(args) {
    "use strict";
    args = args || {};
    var data,
        backData,
        steps = 0,
        advance,
        w,
        h,
        changed = [];

    validateArgs(args, ["height", "width", "data"], "Solver");

    data = args.data;
    w = args.width;
    h = args.height;

    if (data.length && data.length !== w * h) {
        throw new Error("Data size and dimensions do not match.");
    }

    function getNeighbors(x, y) {
        var xOffset,
            yOffset,
            neighbors = 0;
        for (xOffset = -1; xOffset < 2; xOffset += 1) {
            for (yOffset = -1; yOffset < 2; yOffset += 1) {
                if (!(xOffset === 0 && yOffset === 0)) {
                    neighbors += data[
                        ((x + w + xOffset) % w) * h +
                            ((y + h + yOffset) % h)
                    ];
                }
            }
        }
        return neighbors;
    }

    function solveCell(x, y) {
        var liveNeighborCount = getNeighbors(x, y),
            currentState = data[x * h + y],
            newState;

        if (liveNeighborCount === 3 || (liveNeighborCount === 2 && currentState)) {
            newState = true;
        } else {
            newState = false;
        }
        return newState;
    }

    advance = function () {
        var x,
            y;
        changed = [];
        backData = [];
        for (x = 0; x < w; x += 1) {
            for (y = 0; y < h; y += 1) {
                backData.push(solveCell(x, y));
                if (backData[x * h + y] !== data[x * h + y]) {
                    changed.push(x *h + y);
                }
            }
        }
        if (changed.length === 0) {
            data = "STILL LIFE";
        } else {
            data = backData;
        }
        steps += 1;
    };

    return {
        step: function () {
            advance();
            return {data: data, steps: steps, changed: changed};
        }
    };
}

