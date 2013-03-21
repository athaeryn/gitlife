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

if ($records > 0 ) {
    $i = 0;
    while ($i < $records) {
        $user = mysql_result($result, $i, "user");
        $steps = mysql_result($result, $i, "steps");
        if ($steps == "100") $steps = "&infin;";
?>
        <div class="row clearfix">
            <div class="rank">
                <?php echo $i + 1 . '.'?>
            </div>
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
} else { ?>
        <div class="row clearfix">
            <div class="rank">--</div>
            <div class="user">--</div>
            <div class="steps">--</div>
        </div>
<?php
}
?>

