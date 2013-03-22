<?php

if (!$_SERVER['SERVER_ADDR'] == $_SERVER['REMOTE_ADDR']){
  $this->output->set_status_header(400, 'No Remote Access Allowed');
  exit; //just for good measure
}

if (isset($_POST['action']) && isset($_POST['user'])) {
    if ($_POST['action'] == "add") {
        $raw = file_get_contents("users.json");
        $data = json_decode($raw);
        $user = $_POST['user'];
        if (!in_array($user, $data)) {
            array_push($data, $_POST['user']);
        }
        $fh = fopen("users.json", "w");
        fwrite($fh, json_encode($data));
        fclose($fh);
    }
}
?>
