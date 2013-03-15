<?php

if (!isset($_GET['user'])) {
    echo "Error: no user specified.";
} else {
    $user = $_GET['user'];
    $url = 'https://github.com/users/'.$user.'/contributions_calendar_data';
    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);

    /* Check for 404 (file not found). */
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    if($httpCode == 404) {
        /* Handle 404 here. */
        die ('That users does not appear to exist...');
    }

    curl_close($handle);

    echo $response;

}

?>
