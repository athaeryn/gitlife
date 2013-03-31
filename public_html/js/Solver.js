/*global validateArgs, alert */

function Solver(args) {
    "use strict";
    args = args || {};
    var data,
        backData,
        steps = 0,
        initialized,
        advance,
        bake,
        w,
        h;

    validateArgs(args, ["height", "width", "data"], "Solver");

    data = args.data;
    w = args.width;
    h = args.height;

    if (data.length && data.length !== w * h) {
        throw new Error("Data size and dimensions do not match.");
    }

    // bake the neighbors
    (function () {
        var i,
            x,
            xOffset,
            y,
            yOffset,
            neighbors;
        bake = [];
        for (i = 0; i < data.length; i += 1) {
            /* How this is supposed to work:
             *  create an object which acts like a hash
             *  each key will be an index of the data array
             *  the value of the key will be an array of the positions
             *  of the key's neighbors
             * */
            neighbors = [];
            for (x = 0; x < w; x += 1) {
                for (y = 0; y < h; y += 1) {
                    neighbors = [];
                    for (xOffset = -1; xOffset < 2; xOffset += 1) {
                        for (yOffset = -1; yOffset < 2; yOffset += 1) {
                            if (!(xOffset === 0 && yOffset === 0)) {
                                neighbors.push(
                                    ((x + w + xOffset) % w) * h +
                                        ((y + h + yOffset) % h)
                                );
                            }
                        }
                    }
                    bake.push(neighbors);
                }
            }
        }
        return bake;
    }());

    function solveCell(i) {
        var liveNeighborCount = 0,
            currentState = data[i],
            neighbors = bake[i],
            newState,
            j;
        for (j = 0; j < neighbors.length; j += 1) {
            liveNeighborCount += data[neighbors[j]];
        }
        if (liveNeighborCount === 3 || (liveNeighborCount === 2 && currentState)) {
            newState = true;
        } else {
            newState = false;
        }
        return newState;
    }

    advance = function () {
        var cell;
        backData = [];
        for (cell = 0; cell < data.length; cell += 1) {
            backData.push(solveCell(cell));
        }
        data = backData;
        steps += 1;
    };

    return {
        step: function () {
            advance();
            return {data: data, steps: steps};
        }
    };
}

