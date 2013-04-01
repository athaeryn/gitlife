<?php include "header.php" ?>
<div class="page-contain">
    <div class="intro">
        <h1>Greetings!</h1>
        <p>
            This is Gitlife. It&rsquo;s a little pet project I&rsquo;ve been hacking 
            together. Essentially, it takes the nifty
            <a href="https://github.com/blog/1360-introducing-contributions" target="_blank">contributions calendar</a>
            from a Github user&rsquo;s profile and turns it into a simulation of
            <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life" target="_blank">Conway&rsquo;s Game of Life</a>.
            It&rsquo;s still very much in its infancy. However, I&rsquo;ve put it up here
            because I think it&rsquo;s pretty neat. I hope you will too.
        </p>
        <h2>About using it.</h2>
        <p>
            The interface is pretty bad at the moment. I know how I want it to
            work, I just haven&rsquo;t put it together yet. In the meantime, here&rsquo;s
            how you can see it in action:
        </p>
        <ul>
            <li>Type the username of a GitHub user into the field</li>
            <li>Hit &lsquo;Submit&rsquo;</li>
            <li>Enjoy the show</li>
            <li>Repeat!</li>
        </ul>
        <p>
            <b>There is currently a problem with the way the grid 
            &ldquo;wraps&rdquo; at the edges. I&rsquo;m in the process of
            refactoring everything, and this issue will be fixed then.</b>
        </p>
    </div>
    <div class="grid-container">
        <h3 class="clearfix"><span id="userBox">gitlife</span><span 
id="stepsBox">--</span></h3>
        <canvas id="grid" width="634" height="82">
            This website uses HTML5&rsquo;s canvas to function. If you&rsquo;re reading this,
            your browser doesn&rsquo;t support canvas, which means you&rsquo;re probably running
            an old version of IE. Consider updating that old thing so you can
            join in the fun!
        </canvas>
    </div>
    <div class="form-contain">
        <div id="message"></div>
        <form id="user-picker clearfix" action="">
            <input type="text" value="" id="user" placeholder="username">
            <input type="submit" value="Submit" id="submit">
        </form>
    </div>
    <div class="leaderboard">
        <h1>Leaderboard</h1>
        <div class="row legend clearfix">
            <div class="rank">RANK</div>
            <div class="user">USER</div>
            <div class="steps">STEPS</div>
        </div>
        <div class="rows">
            <?php include "leaderboard.php"; ?>
        </div>
    </div>
    <div class="footer">
        by <a href="http://mrmikea.com">Mike Anderson</a>
    </div>
</div>
<?php include "footer.php" ?>
