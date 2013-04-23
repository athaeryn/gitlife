/*jslint browser: true */
/*global $, GameOfLife */

$(document).ready(function () {
    "use strict";

    var W = 53,
        H = 21,
        messageBox = $('#error'),
        stepsBox = $('#stepsBox'),
        readyToRun = false,
        user = "",
        grid = $('#grid'),
        search = $('#search'),
        userInfo = {
            gravatar: $('#gravatar'),
            heading: $('#name'),
            subheading: $('#username')
        },
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
        search.typeahead({
            name: 'username',
            local: json
        });
    });


    // Function to parse the raw data from GitHub
    // Throws errors and temper tantrums if things go awry
    function parseGitHubData(raw) {
        var offset, i, x, y, parsed = [], pad = [];

        // Grab the offset. This is the day of the week that the data begins on,
        // because of the way the contributions calendar is structured.
        offset = (new Date(raw[0][0]).getDay());

        // Map each data point to a boolean representing commits or no commits
        // on each day.
        raw = $.map(raw, function (v) {
            return v[1] > 0;
        });

        if (raw.indexOf(true) === -1) {
            throw new Error("has no (public) commits...");
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
            grid.addClass('clickable');
        } else {
            grid.removeClass('clickable');
        }
    }

    function loadUserInfo(info) {
        userInfo.gravatar.attr(
            'src',
            'http://gravatar.com/avatar/' + info.gravatar_id + '?s=210&d=blank'
        );
        if (info.name) {
            userInfo.heading.html(info.name);
            userInfo.subheading.html(info.login);
        } else {
            userInfo.heading.html(info.login);
            userInfo.subheading.html('');
        }
    }

    function go(user) {
        $.getJSON('/d/' + user, function (data) {
            if (data.error) {
                message(data.error);
            } else {
                try {
                    $.getJSON('https://api.github.com/users/' + user, function (d) {
                        loadUserInfo(d);
                    });
                    game.setData(parseGitHubData(data));
                    document.title = "GitLife (" + user + ")";
                    message(); // Clears the message field.
                    $('#user').val(""); // Reset the user field.
                    // Add the username to the list for typeahead.
                    $.post('json.php', {
                        "action": "add",
                        "user": user
                    });
                    gridClickable(true);
                    search.blur();
                } catch (e) {
                    message(e.message);
                    gridClickable(false);
                }
            }
        });
    }

    search.focus(function () {
        $(this).addClass('wide');
    }).blur(function () {
        $(this).removeClass('wide');
    });

    if (window.location.pathname !== "/") {
        go(window.location.pathname.substring(1, window.location.pathname.length));
    } else {
        loadUserInfo({
            gravatar_id: 'a4db33172b6f59a50b7e9621538026ed',
            name: 'Mike Anderson',
            login: 'athaeryn'
        });
        go('athaeryn');
    }

    // Handle the user submitting the form.
    $('#submit').click(function () {
        user = $('#user').val();
        gridClickable(false);
        message("<img src=\"img/loader.gif\">"); // Clears the message field.
        stepsBox.html('--');
        $("#user").blur();
        search.typeahead('setQuery', '');
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
    grid.click(function () {
        if (readyToRun) {
            game.play(300, function (s) { // onStep
                 //Update the steps box with the current count.
                stepsBox.html(s);
            }, function (s) { // onComplete
                // Display how many steps the simulation took.
                message(user + " went " + s + " step(s)!");
            });
            gridClickable(false);
        } else {
            return;
        }
    });
});

