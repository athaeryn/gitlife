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
        deadStyle = {fill: "#eee", stroke: "none"};
        aliveStyle = {fill: "#1E6822", stroke: "none"};

    function parseData(raw) {
        var parsed = [];

        //  Just throw an error if the data is not valid.
        //  It should start with '['
        if (raw[0] !== '[') return "Error.";

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

        return parsed;
    }
   
    // Initalize the canvas and draw the empty grid
    paper = new Raphael(document.getElementById("grid"), 634, 82);
    drawEmptyGrid();

    // Draws a cell 
    function drawCell(x, y, alive) {
        var cell = paper.rect(x * (cw + cpad), y * (ch + cpad), cw, ch);
        cell.attr(alive ? aliveStyle : deadStyle);
    }

    // Draws the grid with the cell states pulled from data
    function drawGrid() {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                drawCell(x, y, data[(x - 1) * h + y + (7 - startingDay)]);
            }
        }
    }

    // Draws the grid with all the cells "off"
    function drawEmptyGrid() {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                drawCell(x, y, false);
            }
        }
    }

    // Load the data, parse it, and draw the grid
    $.get('getData.php?user=athaeryn', function (d){
        data = parseData(d);
        console.log(data);
        drawGrid();
    });
});
