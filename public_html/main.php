        <div class="page-contain">
            <div class="intro">
                <h1>Greetings!</h1>
                <p>
                    This is gitlife. It takes the nifty
                    <a href="https://github.com/blog/1360-introducing-contributions" target="_blank">contributions calendar</a>
                    from a GitHub user's profile and turns it into a simulation of
                    <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life" target="_blank">Conway's Game of Life</a>.
                    It's still a bit rough around the edges. The biggest problem currently (sans interface, design, etc.) is stopping the simulation once it is composed entirely of oscillators and/or still lifes (AKA nothing interesting is going on anymore). However, it's coming along nicely, so I've put it up&nbsp;here.
                </p>
                <p>
                    The code is up on GitHub <a href="https://github.com/athaeryn/gitlife">over here</a>.
                </p>
                <p>
                    You can direct feedback to <a href="mailto:hello@mrmikea.com">hello@mrmikea.com</a>.
                </p>
                <h2>About using it.</h2>
                <p>
                    The UI is pretty bad at the moment, since I've been focusing more on 
                    the simulation. For now, here's how you can see it in&nbsp;action:
                </p>
                <ul>
                    <li>Type a GitHub username into the field and submit.</li>
                    <li>Click or touch the grid to play the simulation!</li>
                </ul>
            </div>
            <div class="grid-container">
                <h3 class="clearfix"><span id="userBox">--</span><span id="stepsBox">--</span></h3>
                <canvas id="grid" width="634" height="250">
                    This website uses HTML5's canvas to function. If you're reading 
                    this, your browser doesn't support canvas, which means you're 
                    probably running an old version of IE. Consider updating that old 
                    thing so you can join in the fun!
                </canvas>
            </div>
            Speed:
                <select id="speedSelect">
                    <option value="100">Fastest</option>
                    <option value="200">Fast</option>
                    <option value="300" selected>Normal</option>
                    <option value="500">Slow</option>
                    <option value="800">Slowest</option>
                </select>
            <div class="form-contain">
                <div id="message"></div>
                <form id="user-picker clearfix" action="">
                    <input type="text" value="" id="user" placeholder="username">
                    <input type="submit" value="Submit" id="submit">
                </form>
            </div>
        <?php /* ?>
        <!--
            <div class="leaderboard">
                <h1>Leaderboard</h1>
                <div class="row legend clearfix">
                    <div class="rank">RANK</div>
                    <div class="user">USER</div>
                    <div class="steps">STEPS</div>
                </div>
                <div class="rows">
                    <?php leaderboard(); ?>
                </div>
            </div>
        -->
        <?php */ ?>
            <div class="todo">
                <h2>Current todo list:</h2>
                <ul>
                    <li>Make it pretty.</li>
                    <li>Speed control.</li>
                    <li>A way to view your own private contributions.</li>
                    <li>Bring back the leaderboard.</li>
                </ul>
            </div>
            <div class="footer">
                by <a href="http://mrmikea.com">Mike Anderson</a>
            </div>
        </div>

