<?php 

$querystring = $_SERVER['QUERY_STRING'];

$username = "root";
$password = "snorlax";
$database = "gitlife";

mysql_connect('localhost', $username, $password);
@mysql_select_db($database) or die("Unable to select database.");

$query = "SELECT * FROM records ORDER BY steps DESC"; 
$result = mysql_query($query);

$records= mysql_numrows($result);

mysql_close();



include "header.php" ?>
<div class="page-contain">
    <div class="grid-container">
        <h3 class="clearfix"><span id="userBox">--</span><span id="stepsBox">--</span></h3>
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
        <h1>Records</h1>
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
</div>
<?php } ?>
<?php include "footer.php" ?>
