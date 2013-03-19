$(document).ready(function () {
    // Global stuff
    var paper,
        data,
        startingDay,
        cw = 10,
        ch = 10,
        cpad = 2,
        w = 53,
        h = 7,
        deadColor = "#eee";
        aliveColors= "#1E6823,#44A340,#8CC665".split(',');
        messageBox = $('#message');

    function getRandom(c) {
        return c[Math.floor(Math.random() * c.length)];
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
            parsed = "This user has no commits... How boring!";
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
                drawCell(x, y, data[(x - 1) * h + y + (7 - startingDay)]);
            }
        }
    }

    function message(message) {
        messageBox.html(message || "");
    }

    $('#submit').click(function () {
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
                data = d;
                message(); // Clears the message field.
                drawGrid();
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
