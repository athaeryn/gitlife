/*jslint browser: true */
/*global $, GameOfLife */

$(document).ready(function () {
    "use strict";

    var W = 53,
        H = 21,
        messageBox = $('#message'),
        userBox = $('#userBox'),
        stepsBox = $('#stepsBox'),
        readyToRun = false,
        user = "",
        game = new GameOfLife({
            width: W,
            height: H,
            cellSize: 10,
            cellPadding: 2,
            canvas: document.getElementById("grid").getContext('2d'),
            onStep: function (s) { // onStep
                 //Update the steps box with the current count.
                stepsBox.html(s);
            },
            onComplete: function (s) { // onComplete
                // Display how many steps the simulation took.
                message(user + " went " + s + " step(s)!");
                // Save the result to the leaderboard.
                //$.post('save_record.php', {
                    //"user": user,
                    //"steps": s
                //}, function () {
                    //// Fetch the updated leaderboard.
                    //$.get('leaderboard.php', function (board) {
                        //$('.rows').html(board);
                    //});
                //});
            }
        });

    game.clear();
    game.speed($('#speedSelect').val());

    // Get the users list for typeahead
    $.getJSON('../users.json', function (json) {
        $('#user').typeahead({
            name: 'username',
            local: json
        });
    });

    // Function to parse the raw data from GitHub
    // Throws errors and temper tantrums if things go awry
    function parseGitHubData(raw) {
        var offset, i, x, y, parsed = [], pad = [];
        if (raw[0] !== '[') {
            throw new Error("That user does not appear to exist...");
        }

        // Separate the data points.
        raw = raw.split('],[');

        // Grab the offset. This is the day of the week that the data begins on,
        // because of the way the contributions calendar is structured.
        offset = (new Date(raw[0].split('"')[1]).getDay());

        // Map each data point to a boolean representing commits or no commits
        // on each day.
        raw = $.map(raw, function (v) {
            return v.replace(/\[|\]/g, '').split(',')[1] > 0;
        });
        if (raw.indexOf(true) === -1) {
            throw new Error("This user has no (public) commits...");
        }
        // Massage that data
        for (i = 0; i < offset; i += 1) {
            raw.unshift(false);
        }
        while (raw.length > 371) {
            raw.pop();
        }
        // Rotate it
        for (y = 0; y < 7; y += 1) {
            for (x = 0; x < W; x += 1) {
                parsed.push(raw[y + x * 7]);
            }
        }
        // Create the pad
        while (pad.length < 53 * 7) {
            pad.push(false);
        }
        // Return the data, sandwiched in pad
        return pad.concat(parsed, pad);
    }

    function message(msg) {
        messageBox.html(msg || "");
    }

    function gridClickable(yesno) {
        readyToRun = yesno;
        if (readyToRun) {
            $('#grid').addClass('clickable');
        } else {
            $('#grid').removeClass('clickable');
        }
    }

    function go(user) {
        $.get('/d/' + user, function (data) {
            try {
                game.setData(parseGitHubData(data));
                userBox.html(user);
                message(); // Clears the message field.
                $('#user').val(""); // Reset the user field.
                // Add the username to the list for typeahead.
                $.post('json.php', {
                    "action": "add",
                    "user": user
                });
                gridClickable(true);
                // Start the simulation.
            } catch (e) {
                message(e.message);
                gridClickable(false);
            }
        });
    }

    if (window.location.pathname !== "/") {
        go(window.location.pathname.substring(1, window.location.pathname.length));
    }

    // Handle the user submitting the form.
    $('#submit').click(function () {
        user = $('#user').val();
        gridClickable(false);
        message("<img src=\"img/loader.gif\">"); // Clears the message field.
        stepsBox.html('--');
        userBox.html('--');
        $("#user").blur();
        $("#user").typeahead('setQuery', '');
        game.clear();
        try {
            // If no user was entered, we can't go on.
            if (user.length === 0) {
                throw new Error("Please enter a user before clicking that button.");
            }
            // Try to fetch the data and start the simulation.
            go(user);
        } catch (e) {
            message(e.message);
            gridClickable(false);
        } finally {
            $('#user').val("");
            return false;
        }
    });
    $('#grid').click(function () {
        if (readyToRun) {
            game.play();
            gridClickable(false);
        } else {
            return;
        }
    });
    $('#speedSelect').change(function() {
        game.speed($(this).val());
    });
});

