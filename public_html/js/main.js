$(document).ready(function () {

    // Global stuff
    var paper,
        data = [],
        tempData = [],
        startingDay,
        stillRunning = false,
        postOnce = true,
        steps = 0,
        cw = 10,
        ch = 10,
        cpad = 2,
        w = 53,
        h = 7,
        deadColor = "#eee",
        aliveColors= "#1E6823,#44A340,#8CC665".split(','),
        messageBox = $('#message'),
        userBox = $('#userBox'),
        stepsBox = $('#stepsBox');

    function getRandom(c) {
        return c[Math.floor(Math.random() * c.length)];
    }

    function solveCell(x, y, g) {
        c = g[x * w + y];
        n = getNeighbors(x, y, g); 
        if (n === 3 || (n === 2 && c)) {
            return true; 
        } else {
            return false;
        } 
    }
    
    function getNeighbors(x, y, g) { // Position, Grid
        var c = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (i == 0 && j == 0) continue; 
                c += g[((w + x - i) % w) * h + ((h + y - j) % h)];
            } 
        }
        return c;
    }

    function getRandom(collection) {
        return collection[Math.floor(Math.random() * collection.length)];
    }

    function parseData(raw) {
        var parsed = [];

        //  Just throw an error if the data is not valid.
        //  It should start with '['
        if (raw[0] !== '[') return raw;

        // Parse the data from wierdness format to something workable
        raw = raw.split("],[");
        for (var i = 0; i < raw.length; i++) {
            raw[i] = raw[i].replace(/[\[|\]|"]/g, '').split(',');
        }

        // Grab the day of the week of the first data point
        startingDay = new Date(raw[0][0]).getDay();

        // Push the commit counts onto the 'parsed' array
        for (var i = 0; i < raw.length; i++) {
            parsed.push(raw[i][1] > 0);
        }

        // Check to see if the user has any commits
        if (parsed.indexOf(true) < 0) {
            parsed = "This user has no (public) commits... How boring!";
        }

        return parsed;
    }

    // Initalize the canvas and draw the empty grid
    paper = new Raphael(document.getElementById("grid"), 634, 82);
    drawEmptyGrid();

    // Draws a cell
    function drawCell(x, y, alive) {
        var cell = paper.rect(x * (cw + cpad), y * (ch + cpad), cw, ch);
        cell.attr({
            fill: alive ? getRandom(aliveColors) : deadColor,
            stroke: "none"
        });
    }

    // Draws the grid with the cell states pulled from data
    function drawGrid() {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                drawCell(x, y, data[(x) * h + y]);
            }
        }
    }

    function message(message) {
        messageBox.html(message || "");
    }

    $('#submit').click(function () {
        data = [];
        drawEmptyGrid();
        var user = $('#user').val();
        if(user.length === 0) {
            message("Please enter a user before clicking that button.");
            return false;
        }
        // Load the data, parse it, and draw the grid
        $.get('getData.php?user=' + user, function (d){
            d = parseData(d);
            // More sophisticated data validation to be done elsewhere
            // This is simply to determine whether we're dealing with actual
            // data or an error
            if(d instanceof Array) { // Actual data
                for (var a = 0; a < startingDay; a++) {
                    data.push(false);
                }
                for (var b = 0; b < d.length; b++) {
                    data.push(d[b]);
                }
                for (var c = 0; c < (w * h) - d.length; c++) {
                    data.push(false); 
                }
                userBox.html(user);
                message(); // Clears the message field.
                drawGrid();
                stillRunning = true;
                steps = 0;
                postOnce = true;
                var advance = setInterval(function () {
                    if (stillRunning) {
                        stillRunning = false;
                        tempData = [];
                        for (var x = 0; x < w; x++) {
                            for (var y = 0; y < h; y++) {
                                var newState = solveCell(x, y, data);
                                if (newState) {
                                    stillRunning = true;
                                }
                                tempData.push(newState); 
                            } 
                        }
                        steps += 1;
                        stepsBox.html(steps);
                        if (steps >= 100) stillRunning = false;
                        data = tempData;
                        drawGrid();
                        if (!stillRunning && postOnce) {
                            message(user+' went '+steps+' steps!');
                            $.post('save_record.php', {user: user, steps: steps});
                            postOnce = false;
                            clearInterval(advance);
                        }
                    }
                }, 750);
            } else { // Error
                message(d);
                return false;
            }
        });
        return false;
    });

    // Draws the grid with all the cells "off"
    function drawEmptyGrid() {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                drawCell(x, y, false);
            }
        }
    }
});
