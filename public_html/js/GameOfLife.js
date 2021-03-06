/*global validateArgs*/
function GameOfLife(args) {
    "use strict";
    args = args || {};
    validateArgs(args, ["width", "height", "canvas"]);
    var w = args.width,
        h = args.height,
        s = args.cellSize,
        p = args.cellPadding,
        canvas = args.canvas,
        speed = 300,
        onStep = args.onStep,
        onComplete = args.onComplete,
        colors = {
            live: ["#1E6823", "#44A340", "#8CC665"],
            dead: "#EEE"
        },
        data = {
            grid: [],
            backGrid: [],
            steps: 0,
            stat: ""
        },
        runInterval,
        running = false;

    // Randomly selects one of the greens.
    function getLiveColor() {
        return colors.live[Math.floor(Math.random() * colors.live.length)];
    }

    function indexFromCoords(x, y, wrap) {
        if (wrap) {
            x = (x + w) % w;
            y = (y + h) % h;
        }
        return x + y * w;
    }

    function eachCell(callback) {
        var x,
            y;
        for (y = 0; y < h; y += 1) {
            for (x = 0; x < w; x += 1) {
                callback(x, y, indexFromCoords(x, y));
            }
        }
    }

    function drawCell(x, y, alive) {
        // Get the appropriate color,
        canvas.fillStyle = alive ? getLiveColor() : colors.dead;
        // and draw the cell.
        canvas.fillRect(x * (s + p), y * (s + p), s, s);
    }

    function drawGrid(array) {
        array = array || [false];
        eachCell(function (x, y, index) {
            drawCell(x, y, array[index]);
        });
    }

    function getNeighbors(x, y) {
        var xOffset,
            yOffset,
            neighbors = 0;
        for (xOffset = -1; xOffset < 2; xOffset += 1) {
            for (yOffset = -1; yOffset < 2; yOffset += 1) {
                if (!(xOffset === 0 && yOffset === 0)) {
                    neighbors += data.grid[
                        indexFromCoords(
                            x + xOffset,
                            y + yOffset,
                            true // wrap
                        )
                    ];
                }
            }
        }
        return neighbors;
    }

    function solveCell(x, y) {
        var neighbors = getNeighbors(x, y),
            living = data.grid[indexFromCoords(x, y)];
        return (neighbors === 3 ||
                (neighbors === 2 && living));
    }

    function advance() {
        var state, stepchange = 0, living = false;
        data.backGrid = [];
        eachCell(function (x, y, index) {
            state = solveCell(x, y);
            data.backGrid.push(state);
            if (state) { living = true; }
            if (state !== data.grid[index]) {
                stepchange += 1;
                drawCell(x, y, state);
            }
        });
        data.grid = data.backGrid;
        data.steps += 1;
        if (onStep) { onStep(data.steps); }
        if (stepchange === 0 || !living) {
            clearInterval(runInterval);
            onComplete(data.steps);
        }
    }

    function reset() {
        data.grid = [];
        data.backGrid = [];
        data.steps = 0;
        clearInterval(runInterval);
        running = false;
    }

    function runSimulation(speed) {
        runInterval = setInterval(function () {
            advance();
        }, speed);
    }

    return {
        clear: function () {
            reset();
            drawGrid();
        },
        setData: function (d) {
            reset();
            data.grid = d;
            drawGrid(data.grid);
        },
        play: function (speed, stepCallback, completeCallback) {
            onStep = function (steps) {
                stepCallback(steps);
            };
            onComplete = function (steps) {
                completeCallback(steps);
            };
            runSimulation(speed);
        }
    };
}
