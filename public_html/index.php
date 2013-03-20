<?php 

$querystring = $_SERVER['QUERY_STRING'];

$username = "root";
$password = "snorlax";
$database = "gitlife";

mysql_connect('localhost', $username, $password);
@mysql_select_db($database) or die("Unable to select database.");

$query = "SELECT * FROM records ORDER BY steps DESC, user ASC"; 
$result = mysql_query($query);

$records= mysql_numrows($result);

mysql_close();



include "header.php" ?>
<div class="page-contain">
    <div class="intro">
        <h1>Greetings!</h1>
        <p>
            This is Gitlife. It's a little pet project I've been hacking 
            together. Essentially, it takes the nifty
            <a href="https://github.com/blog/1360-introducing-contributions" target="_blank">contributions calendar</a>
            from a Github user's profile and turns it into a simulation of
            <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life" target="_blank">Conway's Game of Life</a>.
            It's still very much in its infancy. However, I've put it up here
            because I think it's pretty neat. I hope you will too.
        </p>
        <h2>About using it.</h2>
        <p>
            The interface is pretty bad at the moment. I know how I want it to
            work, I just haven't put it together yet. I'm working with Github's
            awesome support people to try and implement part of it. In the
            meantime, here's how you can see it in action:
        </p>
        <ul>
            <li>Type the username of a GitHub user into the field</li>
            <li>Hit 'Submit'</li>
            <li>Press step until the simulation is complete (or you reach 100 steps)</li>
            <li>That user's "score" will be added to the Leaderboard</li>
            <li>Repeat!</li>
        </ul>
        <p>
            Also, you'll have to refresh the page if you want to see the updated
            leaderboard. Like I said, this is a work in progress at this point,
            but have fun anyway!
        </p>
    </div>
    <div class="grid-container">
        <h3 class="clearfix"><span id="userBox">gitlife</span><span 
id="stepsBox">--</span></h3>
        <div id="grid"></div>
    </div>
    <div class="form-contain">
        <div id="message"></div>
        <form id="user-picker" action="">
            <input type="text" value="" id="user" placeholder="username">
            <input type="submit" value="Submit" id="submit">
            <input type="button" value="Step" id="step">
        </form>
    </div>
<?php if ($records > 0 ) { ?>
    <div class="records">
        <h1>Leaderboard</h1>
        <div class="row clearfix">
            <div class="user">USER</div>
            <div class="steps">STEPS</div>
        </div>

<?php
    $i = 0;
    while ($i < $records) {
        $user = mysql_result($result, $i, "user");
        $steps = mysql_result($result, $i, "steps");
?>

        <div class="row clearfix">
            <div class="user">
                <a href="https://github.com/<?php echo $user; ?>">
                    <?php echo $user; ?>
                </a>
            </div>
            <div class="steps"><?php echo $steps; ?></div>
        </div>
<?php 
        $i++;
    }
?> 
    </div>
<?php } ?>
    <div class="footer">
        by <a href="http://mrmikea.com">Mike Anderson</a>
    </div>
</div>
<?php include "footer.php" ?>
