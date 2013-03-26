/* global $:false */
$(document).ready(function () {
    "use strict";
    function Grid (props) {
        var tempData = [],
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

        function advance (callback) {
            tempData = [];
            var stillGoing = false;
            for (var x = 0; x < w; x++) {
                for (var y = 0; y < h; y++) {
                    var newState = solveCell(x, y, data);
                    if (newState) { stillGoing = true; }
                    if (newState !== data[x * h + y]) { drawCell(x, y, newState); }
                    tempData.push(newState);
                }
            }
            data = tempData;
            if (callback) { callback({"stillGoing": stillGoing}); }
        }

        function drawCell(x, y, alive) {
            canvas.fillStyle = alive ? getLiveColor() : colors.dead;
            canvas.fillRect(x * (s + p), y * (s + p), s, s);
        }

        function getLiveColor() {
            return colors.live[Math.floor(Math.random() * colors.live.length)];
        }

        function solveCell(x, y, g) {
            var c = g[x * w + y],
                n = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) { continue; }
                    n += g[((w + x - i) % w) * h + ((h + y - j) % h)];
                }
            }
            if (n === 3 || (n === 2 && c)) {
                return true;
            } else {
                return false;
            }
        }

        function drawGrid() {
            for (var x = 0; x < w; x++) {
                for (var y = 0; y < h; y++) {
                    drawCell(x, y, data ? data[x * h + y] : false);
                }
            }
        }

        function play(onStep, onComplete) {
            runInterval = setInterval(function () {
                steps++;
                advance(function (q) {
                    if (onStep) { onStep(steps); }
                    if(!q.stillGoing || steps >= 100) {
                        clearInterval(runInterval);
                        if (onComplete) { onComplete(steps); }
                    }
                });
            }, 750);
        }

        return {
            "giveData": function (d) {
                setData(d);
            },
            "reset": function () {
                steps = 0;
                running = false;
                clearInterval(runInterval);
                drawGrid();
            },
            "draw": function () {
                drawGrid();
            },
            "play": function (onStep, onComplete) {
                play(onStep, onComplete);
            },
            "step": function () {
                advance();
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

    g.reset();

    $.getJSON('../users.json', function (json) {
        $('#user').typeahead({
            name: 'users',
            local: json
        });
    });

    function parseData(raw, w, h) {
        var parsed = [],
            startingDay,
            adjusted = [];

        //  Just throw an error if the data is not valid.
        //  It should start with '['
        if (raw[0] !== '[') { throw raw; }

        // Parse the data from wierdness format to something workable
        raw = raw.split("],[");
        for (var i = 0; i < raw.length; i++) {
            raw[i] = raw[i].replace(/[\[|\]|"]/g, '').split(',');
        }

        // Grab the day of the week of the first data point
        startingDay = new Date(raw[0][0]).getDay();

        // Push the commit counts onto the 'parsed' array
        for (var j = 0; j < raw.length; j++) {
            parsed.push(raw[j][1] > 0);
        }

        // Check to see if the user has any commits
        if (parsed.indexOf(true) < 0) {
            throw "This user has no (public) commits... How boring!";
        }

        // The data needs to be adjusted based on the day of the week the data
        // starts.
        for (var a = 0; a < startingDay; a++) {
            adjusted.push(false);
        }
        for (var b = 0; b < parsed.length; b++) {
            adjusted.push(parsed[b]);
        }
        for (var c = 0; c < (w * h) - adjusted.length; c++) {
            adjusted.push(false);
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

    function tryStartSim(user, data) {
        try{
            data = parseData(data, 53, 7);
            userBox.html(user);
            message(); // Clears the message field.
            $('#user').val("");
            g.giveData(data);
            g.draw();
            $.post('json.php', {
                "action": "add",
                "user": user
            });
            g.play(function(s){ // onStep
                stepsBox.html(s);
            }, function (s) { // onComplete
                message(user + " went " + s + " step(s)!");
                $.post('save_record.php', {
                    "user": user,
                    "steps": s
                }, function() {
                    $.get('leaderboard.php', function (board) {
                        $('.rows').html(board);
                    });
                });
            });
        } catch (e) {
            message(e);
        }
    }

    $('#submit').click(function () {
        $("#user").blur();
        g.reset();
        var user = $('#user').val();
        try{
            if(user.length === 0) {
                throw "Please enter a user before clicking that button.";
            }
            $.get('getData.php?user=' + user, function (data){
                tryStartSim(user, data);
            });
        } catch (e) {
            message(e);
        } finally {
            return false;
        }
    });
});

