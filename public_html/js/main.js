/* global $:false */
$(document).ready(function () {
    "use strict";
    function Grid (props) {
        var tempData = [], // Basically, a back buffer.
            w = props.width,
            h = props.height,
            s = props.cellSize,
            p = props.cellPadding,
            canvas = props.canvas,
            runInterval,
            running = false,
            colors = {
                "live": "#1E6823,#44A340,#8CC665".split(','),
                "dead": "#EEE"
            },
            steps = 0,
            data;

        function setData(d) {
            data = d;
        }

        // A "step" in the simulation.
        function advance (callback) {
            // Reset the tempData.
            tempData = [];
            // Guilty until proven innocent.
            var stillGoing = false;
            // For each x...
            for (var x = 0; x < w; x++) {
                // ...loop over each y.
                for (var y = 0; y < h; y++) {
                    // Solve for the new state.
                    var newState = solveCell(x, y, data);
                    // As long as one cell is still alive, we keep going.
                    if (newState) { stillGoing = true; }
                    // Only draw the cell if the state has changed.
                    if (newState !== data[x * h + y]) {
                        drawCell(x, y, newState);
                    }
                    // Store the new state in the back buffer.
                    tempData.push(newState);
                }
            }
            // Advance a step
            steps++;
            // Show the back buffer.
            data = tempData;
            // Call le callback.
            if (callback) { callback(stillGoing, steps); }
        }

        function drawCell(x, y, alive) {
            // Get the appropriate color,
            canvas.fillStyle = alive ? getLiveColor() : colors.dead;
            // and draw the cell.
            canvas.fillRect(x * (s + p), y * (s + p), s, s);
        }

        // Randomly selects one of the greens.
        function getLiveColor() {
            return colors.live[Math.floor(Math.random() * colors.live.length)];
        }

        // This is complicate.
        function solveCell(x, y, g) {
            // c -> the current state (true or false).
            var c = g[x * w + y],
            // n -> the number of adjacent living cells, or "neighbors"
                n = 0;
            // The nested for loops give us the coordinates:
            // (x - 1, y - 1)
            // (x - 1, y + 0)
            // (x - 1, y + 1)
            // (x + 0, y - 1)
            // (x + 0, y + 0) this one is thrown out (the "continue" statement).
            // (x + 0, y + 1)
            // (x + 1, y - 1)
            // (x + 1, y + 0)
            // (x + 1, y + 1)
            // AKA all the neighbors.
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) { continue; }
                    // Don't try and understand this. Just embrace it.
                    n += g[((w + x - i) % w) * h + ((h + y - j) % h)];
                    // But really, what it does is grab the value of a cell at
                    // a location, and wrap around the edges of the grid if it
                    // needs to.
                }
            }
            // Rules of Conway's game of life:
            // - Any cell with more than 3 neighbors dies from overcrowding
            // - Any cell with less than 2 neighbors dies of loneliness
            // - Any live cell with 2 or 3 neighbors lives on
            // - Any dead cell with exactly three neighbors is born
            // These can be boiled down to:
            // - Any cell with three neighbors lives
            // - A live cell with two neighbors lives
            // - Everyone else dies
            if (n === 3 || (n === 2 && c)) {
                return true;
            } else {
                return false;
            }
        }

        // This function is only used to reset the grid. During the actual
        // simulation, cells are only drawn when they change states.
        function drawGrid() {
            for (var x = 0; x < w; x++) {
                for (var y = 0; y < h; y++) {
                    // The only thing close to complicated in this function.
                    // All it does is pass along the state of the cell so that
                    // it can be drawn in the appropriate color.
                    drawCell(x, y, data ? data[x * h + y] : false);
                }
            }
        }

        // Starts the simulation. Accepts two call back functions:
        // - one that is run each step
        // - ont that is run when the simulation is complete
        function play(onStep, onComplete) {
            runInterval = setInterval(function () {
                // Advance the simulation
                advance(function (steps, stillGoing) {
                    // Call the onStep callback
                    if (onStep) { onStep(steps); }
                    // If the simulation ends or takes more than 100 steps...
                    if(!stillGoing || steps >= 100) {
                        // ...stop it,
                        clearInterval(runInterval);
                        // and call the onComplete callback.
                        if (onComplete) { onComplete(steps); }
                    }
                });
            }, 750);
        }

        return {
            // Used to pass the data to the Grid.
            "giveData": function (d) {
                setData(d);
            },
            // Reset everything.
            "reset": function () {
                steps = 0;
                running = false;
                clearInterval(runInterval);
                drawGrid();
            },
            // Draws the grid. Not used during the simulation.
            "draw": function () {
                drawGrid();
            },
            // Start the simulation.
            "play": function (onStep, onComplete) {
                play(onStep, onComplete);
            }
        };
    }

    var g = new Grid({
        "width": 53,
        "height": 7,
        "cellSize": 10,
        "cellPadding": 2,
        "canvas": document.getElementById("grid").getContext('2d')
    }),
        messageBox = $('#message'),
        userBox = $('#userBox'),
        stepsBox = $('#stepsBox');

    // Draw the blank grid
    g.reset();

    // Get the users list for typeahead
    $.getJSON('../users.json', function (json) {
        $('#user').typeahead({
            name: 'users',
            local: json
        });
    });

    // Function to parse the raw data from GitHub
    // Throws errors and temper tantrums if things go awry
    // Params: the data, and the width and height of the grid
    function parseData(raw, w, h) {
        var parsed = [],
            startingDay,
            adjusted = [];

        // The data should start with '[' if it was retrieved successfully.
        // If not, we don't want to try and parse it.
        // raw should contain the error message from getData.php
        if (raw[0] !== '[') { throw raw; }

        // Get the data out of wierdness format and in to something workable
        raw = raw.split("],["); // Separate the data points
        for (var i = 0; i < raw.length; i++) {
            // And remove bad characters
            raw[i] = raw[i].replace(/[\[|\]|"]/g, '').split(',');
        }

        // Grab the day of the week of the first data point
        // This will be used to offset the data so that data points
        // are correctly aligned with the days of the week in the calendar
        startingDay = new Date(raw[0][0]).getDay();

        // Push the commit counts onto the 'parsed' array
        parsed = $.map(raw, function (val){
            return val[1] > 0;
        });

        // Check to see if the user has any commits
        if (parsed.indexOf(true) < 0) {
            throw "This user has no (public) commits... How boring!";
        }

        // The data needs to be adjusted based on the day of the week the data
        // starts.
        for (var b = 0; b < w * h; b++) {
            adjusted.push(parsed[b - startingDay] || false);
        }

        // Last little check, just to be careful!
        if (!(adjusted instanceof Array)) {
            throw "Error parsing data.";
        }
        return adjusted;
    }

    function message(msg) {
        messageBox.html(msg || "");
    }

    // Try to start the simulation
    function tryStartSim(user, data) {
        // We need to catch errors, parseData is a whiner.
        try{
            data = parseData(data, g.getWidth(), g.getHeight());
            userBox.html(user);
            message(); // Clears the message field.
            $('#user').val(""); // Reset the user field.
            g.giveData(data); // Hand over the data.
            g.draw(); // Draw the starting state of the simulation.
            // Add the username to the list for typeahead.
            $.post('json.php', {
                "action": "add",
                "user": user
            });
            // Start the simulation.
            g.play(function(s){ // onStep
                // Update the steps box with the current count.
                stepsBox.html(s);
            }, function (s) { // onComplete
                // Display how many steps the simulation took.
                message(user + " went " + s + " step(s)!");
                // Save the result to the leaderboard.
                $.post('save_record.php', {
                    "user": user,
                    "steps": s
                }, function() {
                    // Fetch the updated leaderboard.
                    $.get('leaderboard.php', function (board) {
                        $('.rows').html(board);
                    });
                });
            });
        } catch (e) {
            message(e);
        }
    }

    // Handle the user submitting the form.
    $('#submit').click(function () {
        $("#user").blur();
        g.reset();
        var user = $('#user').val();
        try{
            // If no user was entered, we can't go on.
            if(user.length === 0) {
                throw "Please enter a user before clicking that button.";
            }
            // Try to fetch the data and start the simulation.
            $.get('getData.php?user=' + user, function (data){
                tryStartSim(user, data);
            });
        } catch (e) {
            message(e);
        } finally {
            // This is to keep the page from reloading.
            return false;
        }
    });
});

