import GameOfLife from './GameOfLife'

$(document).ready(function () {
    "use strict"

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

    // Function to parse the raw data from GitHub
    function parseGitHubData(raw) {
        console.log(raw)
        return raw.reduce(function (rows, row) {
          row.forEach(function (day) {
            if (!day) return
            var x = day.x
            var y = day.y
            rows[y + x * 7] = day.count > 0
          })
          return rows
        }, [])
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
        console.log(info)
        userInfo.gravatar.attr(
            'src',
            info.avatar_url
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
        $.getJSON(`/data/${user}`, function (data) {
            if (data.error) {
                message(data.error);
            } else {
                try {
                    $.getJSON('https://api.github.com/users/' + user, function (d) {
                      console.log(d)
                        loadUserInfo(d);
                    });
                    game.setData(parseGitHubData(data));
                    document.title = "GitLife (" + user + ")";
                    message(); // Clears the message field.
                    gridClickable(true);
                    search.blur();
                } catch (e) {
                    message(e.message);
                    gridClickable(false);
                }
            }
        });
    }

    $('#about-toggle').click(function () {
      $('#about-content').toggle('fast');
    });

    search.focus(function () {
      $(this).addClass('focus');
    }).blur(function () {
      $(this).removeClass('focus');
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
        user = search.val();
        if (user.length === 0) {
            return false;
        }
        gridClickable(false);
        //message("<img src=\"img/loader.gif\">");
        stepsBox.html('--');
        search.blur();
        // search.typeahead('setQuery', '');
        game.clear();
        try {
            // If no user was entered, we can't go on.
            // Try to fetch the data and start the simulation.
            go(user);
        } catch (e) {
            message(e.message);
            gridClickable(false);
        } finally {
            search.val("");
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
                message("went " + s + " step(s)!");
            });
            gridClickable(false);
        } else {
            return;
        }
    });
    $('#speedSelect').change(function() {
        game.speed($(this).val());
    });
});

