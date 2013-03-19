<?php

if (!$_SERVER['SERVER_ADDR'] == $_SERVER['REMOTE_ADDR']){
  $this->output->set_status_header(400, 'No Remote Access Allowed');
  exit; //just for good measure
}

if (isset($_POST['user']) && isset($_POST['steps'])) {

    $querystring = $_SERVER['QUERY_STRING'];

    $query = "INSERT INTO records(user, steps) VALUES ('$_POST[user]', '$_POST[steps]') ON DUPLICATE KEY UPDATE steps=$_POST[steps], last_update=NULL";

    $username = "root";
    $password = "snorlax";
    $database = "gitlife";

    mysql_connect('localhost', $username, $password);
    @mysql_select_db($database) or die("Unable to select database.");

    $result = mysql_query($query);

    mysql_close();
}
?>

