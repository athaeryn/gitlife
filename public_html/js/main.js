$(document).ready(function () {

    function parseData(data) {
        if (data[0] !== '[') {
            return "Error.";
        } else {
            data = data.split("],["); 
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].replace(/[\[|\]]/g, ''); 
                data[i] = data[i].split(',');
            }
        }
        return data;
    }

    $.get('getData.php?user=athaeryn', function (d){
        console.log(parseData(d));
    });


    var paper = new Raphael(document.getElementById("grid"), 634, 82),
        cw = 10,
        ch = 10,
        cpad = 2,
        w = 53,
        h = 7,
        boxStyle = {fill: "#eee", stroke: "none"};

    paper.rect(0, 0, 634, 82).attr({fill: "#fff", stroke: "none"});

});
