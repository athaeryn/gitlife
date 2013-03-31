/*jslint browser: true */
/*global $, Grid, Solver */
var grid, solver;
$(document).ready(function () {
    "use strict";

    var W = 53,
        H = 7,
        messageBox = $('#message'),
        userBox = $('#userBox'),
        stepsBox = $('#stepsBox');

    grid = new Grid({
        width: W,
        height: H,
        cellSize: 10,
        cellPadding: 2,
        canvas: document.getElementById("grid").getContext('2d')
    });
    solver = new Solver({
        width: W,
        height: H
    });

    grid.clear();

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
    function parseGitHubData(raw, w, h) {
        var parsed = [],
            startingDay,
            adjusted = [],
            i,
            j;

        // The data should start with '[' if it was retrieved successfully.
        // raw should contain the error message from getData.php
        if (raw[0] !== '[') { throw new Error(raw); }

        // Get the data out of wierdness format and in to something workable
        raw = raw.split("],["); // Separate the data points
        for (i = 0; i < raw.length; i += 1) {
            // And remove bad characters
            raw[i] = raw[i].replace(/[\[|\]|"]/g, '').split(',');
        }

        // Grab the day of the week of the first data point for offsetting
        startingDay = new Date(raw[0][0]).getDay();

        // Push the commit counts onto the 'parsed' array
        parsed = $.map(raw, function (val) {
            return val[1] > 0;
        });

        // Check to see if the user has any commits
        if (parsed.indexOf(true) < 0) {
            throw new Error("This user has no (public) commits... How boring!");
        }

        // The data needs to be adjusted based on the day of the week the data
        // starts.
        for (j = 0; j < (w * h - startingDay + 1); j += 1) {
            adjusted.push(parsed[j - startingDay] || false);
        }

        if (!(adjusted instanceof Array)) {
            throw new Error("Error parsing data.");
        }
        return adjusted;
    }

    function message(msg) {
        messageBox.html(msg || "");
    }

    // Try to start the simulation
    function tryStartSim(user, data) {
        // We need to catch errors, parseGitHubData is a whiner.
        try {
            data = parseGitHubData(data, grid.getWidth(), grid.getHeight());
            userBox.html(user);
            message(); // Clears the message field.
            $('#user').val(""); // Reset the user field.
            grid.giveData(data); // Hand over the data.
            grid.draw(); // Draw the starting state of the simulation.
            // Add the username to the list for typeahead.
            $.post('json.php', {
                "action": "add",
                "user": user
            });
            // Start the simulation.
            grid.play(function (s) { // onStep
                // Update the steps box with the current count.
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
    }

    // Handle the user submitting the form.
    $('#submit').click(function () {
        $("#user").blur();
        grid.reset();
        var user = $('#user').val();
        try {
            // If no user was entered, we can't go on.
            if (user.length === 0) {
                throw new Error("Please enter a user before clicking that button.");
            }
            // Try to fetch the data and start the simulation.
            $.get('getData.php?user=' + user, function (data) {
                tryStartSim(user, data);
            });
        } catch (e) {
            message(e);
        } finally {
            // This is to keep the page from reloading.
            return false;
        }
    });
});

