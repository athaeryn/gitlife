<?php


$root = $_SERVER['DOCUMENT_ROOT'];
$app = $root."/../app/";

require_once $app."config.default.php";
require_once $app."config.php";

function leaderboard() {
    mysql_connect('localhost', $GLOBALS['db_user'], $GLOBALS['db_pass']);
    @mysql_select_db('gitlife') or die("");

    $query = "SELECT * FROM records ORDER BY steps DESC, user ASC";
    $result = mysql_query($query) or die("");

    $records= mysql_numrows($result) or die("");

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

}

function data($user) {
    if (!isset($user) || $user === "") {
        echo "Error: no user specified.";
    } else {
        $url = 'https://github.com/users/'.$user.'/contributions_calendar_data';
        $handle = curl_init($url);
        curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

        /* Get the HTML or whatever is linked in $url. */
        $response = curl_exec($handle);

        /* Check for 404 (file not found). */
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        if($httpCode == 404) {
            /* Handle 404 here. */
            die ('{"error": "That users does not appear to exist..."}');
        }

        curl_close($handle);

        echo $response;
    }
}

function users_json($user) {
    if (!$_SERVER['SERVER_ADDR'] == $_SERVER['REMOTE_ADDR']){
      $this->output->set_status_header(400, 'No Remote Access Allowed');
      exit; //just for good measure
    }
    $user = strtolower($user);
    $raw = file_get_contents("users.json");
    $data = json_decode($raw);
    if (!is_array($data)) {
        $data = array();
    }
    if (!in_array($user, $data)) {
        array_push($data, $user);
    }
    $fh = fopen("users.json", "w");
    fwrite($fh, json_encode($data));
    fclose($fh);
}

switch (substr($_SERVER['REQUEST_URI'], 0, 3)) {
    case '/d/':
        $username = substr($_SERVER['REQUEST_URI'], 3);
        if (!empty($username)) {
            data($username);
            exit;
        }
        break;
    case '/j/':
        $username = substr($_SERVER['REQUEST_URI'], 3);
        if (!empty($username)) {
            users_json($username);
            exit;
        }
        break;
}

include "main.php";
