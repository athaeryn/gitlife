/*jslint browser: true, unused: false*/
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
        var parsed = [],
            adjusted = [],
            i,
            j,
            offset,
            pad = [];

        // The data should start with '[' if it was retrieved successfully.
        // raw should contain the error message from getData.php
        if (raw[0] !== '[') { throw new Error(raw); }

        // Get the data out of .weird format and in to something workable
        raw = raw.split("],["); // Separate the data points
        for (i = 0; i < raw.length; i += 1) {
            // And remove bad characters
            raw[i] = raw[i].replace(/[\[|\]|"]/g, '').split(',');
        }

        // Offset by the day of the week of the first data point
        offset = 7 - new Date(raw[0][0]).getDay();

        // Push the commit counts onto the 'parsed' array
        parsed = $.map(raw, function (val) {
            return val[1] > 0;
        });

        // Check to see if the user has any commits
        if (parsed.indexOf(true) < 0) {
            throw new Error("This user has no (public) commits... How boring!");
        }

        for (j = offset; j < (W * 7) + offset; j += 1) {
            adjusted[j] = parsed[j];
        }

        for (j = 0; j < W * 7; j += 1) {
            pad[j] = j % 4 ? false : true;
        }

        if (!(adjusted instanceof Array)) {
            throw new Error("Error parsing data.");
        }
        return pad.concat(adjusted, pad);
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
                    game.setData(parseGitHubData(data));
                    userBox.html(user);
                    message(); // Clears the message field.
                    $('#user').val(""); // Reset the user field.
                    // Add the username to the list for typeahead.
                    $.post('json.php', {
                        "action": "add",
                        "user": user
                    });
                    // Start the simulation.
                    //game.play(400, function (s) { // onStep
                         ////Update the steps box with the current count.
                        //stepsBox.html(s);
                    //}, function (s) { // onComplete
                        //// Display how many steps the simulation took.
                        //message(user + " went " + s + " step(s)!");
                        //// Save the result to the leaderboard.
                        //$.post('save_record.php', {
                            //"user": user,
                            //"steps": s
                        //}, function () {
                            //// Fetch the updated leaderboard.
                            //$.get('leaderboard.php', function (board) {
                                //$('.rows').html(board);
                            //});
                        //});
                    //});
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

