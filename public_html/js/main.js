$(document).ready(function () {

    function parseData(data) {
        if (data[0] !== '[') {
            return "Error.";
        } else {
            data = data.split("],["); 
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].replace(/[\[|\]|"]/g, ''); 
                data[i] = data[i].split(',');
            }
        }
        
        important = [];
        important[0] = -(new Date(data[0][0]).getDay());

        for (var i = 0; i < data.length; i++) {
            if (data[i][1] > 0) {
                //important.push(data[i][0]);
                important.push(i);
            }
        }

        return important;
    }

    var paper = new Raphael(document.getElementById("grid"), 634, 82),
        cw = 10,
        ch = 10,
        cpad = 2,
        w = 53,
        h = 7,
        dead = {fill: "#eee", stroke: "none"};
        alive = {fill: "#1E6822", stroke: "none"};

    paper.rect(0, 0, 634, 82).attr({fill: "#fff", stroke: "none"});

    function drawCell(x, y, state) {
        var cell = paper.rect(x * (cw + cpad), y * (ch + cpad), cw, ch);
        cell.attr(state > 0 ? alive : dead);
    }

    function drawGrid(data) {
        var first = -data[0];
        console.log(first);
        for (var x = 0; x < 53; x++) {
            var yStart = x === 0 ? first : 0;
            var yEnd = x === 52 ? 7 - (5 - first) : 7;
            for (var y = yStart; y < yEnd; y++) {
                drawCell(x, y, 0);
            }
        }
    }

    $.get('getData.php?user=athaeryn', function (d){
        console.log(parseData(d));
        drawGrid(parseData(d));
    });
});
