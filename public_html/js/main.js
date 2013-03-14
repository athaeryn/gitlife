$(document).ready(function () {

    var paper = new Raphael(document.getElementById("grid"), 634, 82),
        w = 10,
        h = 10,
        pad = 2;

    paper.rect(0, 0, 634, 82).attr({fill: "#fff", stroke: "none"});

    paper.rect(0, 0, 10, 10).attr({fill: "#eee", stroke: "none"});
    paper.rect(12, 0, 10, 10).attr({fill: "#eee", stroke: "none"});
});
