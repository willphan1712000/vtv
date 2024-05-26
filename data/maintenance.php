<?php
    $v = 6;
    // $v = 5.395;
    $sessionDuration = 60*60;
    $title = basename(dirname(__DIR__));

    // Database Information
    $servername = "localhost:3306";
    $username = "allincli_ssadmin";
    $password= "123456";
    // $username = "root";
    // $password= "";
    $dbName = "allincli_vtv_".str_replace('.','_',basename(dirname(__DIR__)));

    $multiImgMax = 30;
    $multiVideoMax = 2;
    $maxVideoDuration = 60; // seconds
    $copyright = "© ".date("Y")." All in Click, LLC. All rights reserved. ".$v;

    function dd($value) {
        echo "<pre>";
        var_dump($value);
        echo "</pre>";
    
        die();
    }
?>