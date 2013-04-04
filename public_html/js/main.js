/*jslint browser: true */
/*global $, GameOfLife */
var game;

$(document).ready(function () {
    "use strict";

    var W = 53,
        H = 21,
        messageBox = $('#message'),
        userBox = $('#userBox'),
        stepsBox = $('#stepsBox');

    game = new GameOfLife({
        width: W,
        height: H,
        cellSize: 10,
        cellPadding: 2,
        canvas: document.getElementById("grid").getContext('2d')
    });

    game.clear();

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
    function parseGitHubData(raw) {
        var offset, i, x, y, parsed = [], pad = [];
        if (raw[0] !== '[') {
            throw new Error("That user does not appear to exist...");
        }

        // Separate the data points.
        raw = raw.split('],[');

        offset = (new Date(raw[0].split('"')[1]).getDay());

        raw = $.map(raw, function (v) {
            return v.replace(/\[|\]/g, '').split(',')[1] > 0;
        });
        if (raw.indexOf(true) === -1) {
            throw new Error("This user has no (public) commits...");
        }
        for (i = 0; i < offset; i += 1) {
            raw.unshift(false);
        }
        while (raw.length > 371) {
            raw.pop();
        }
        for (y = 0; y < 7; y += 1) {
            for (x = 0; x < W; x += 1) {
                parsed.push(raw[y + x * 7]);
            }
        }
        while (pad.length < 53 * 7) {
            pad.push(false);
        }
        console.log([
            offset,
            raw.length,
            raw
        ]);
        return pad.concat(parsed, pad);
    }

    function message(msg) {
        messageBox.html(msg || "");
    }



    // Handle the user submitting the form.
    $('#submit').click(function () {
        var user = $('#user').val();
        stepsBox.html('--');
        userBox.html('gitlife');
        $("#user").blur();
        game.clear();
        try {
            // If no user was entered, we can't go on.
            if (user.length === 0) {
                throw new Error("Please enter a user before clicking that button.");
            }
            // Try to fetch the data and start the simulation.
            $.get('getData.php?user=' + user, function (data) {
                try {
                    userBox.html(user);
                    message(); // Clears the message field.
                    game.setData(parseGitHubData(data));
                    $('#user').val(""); // Reset the user field.
                    // Add the username to the list for typeahead.
                    $.post('json.php', {
                        "action": "add",
                        "user": user
                    });
                    // Start the simulation.
                    game.play(300, function (s) { // onStep
                         //Update the steps box with the current count.
                        stepsBox.html(s);
                    }, function (s) { // onComplete
                        // Display how many steps the simulation took.
                        message(user + " went " + s + " step(s)!");
                        // Save the result to the leaderboard.
                        $.post('save_record.php', {
                            "user": user,
                            "steps": s
                        }, function () {
                            // Fetch the updated leaderboard.
                            $.get('leaderboard.php', function (board) {
                                $('.rows').html(board);
                            });
                        });
                    });
                } catch (e) {
                    message(e.message);
                }
            });
        } catch (e) {
            message(e);
        } finally {
            return false;
        }
    });
});

