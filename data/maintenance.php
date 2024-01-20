<?php
    $v = 0;
    // $sessionDuration = 60*20;
    $sessionDuration = 60*60;
    $title = basename(dirname(__DIR__));

    // Database Information
    $servername = "localhost:3306";
    $username = "root";
    // $username = "allincli_ssadmin";
    $password= "";
    // $password= "123456";
    $dbName = "allincli_vtv_".str_replace('.','_',basename(dirname(__DIR__)));

    $multiImgMax = 10;
    $multiVideoMax = 2;
    $copyright = "© ".date("Y")." All in Click, LLC. All rights reserved."
?>