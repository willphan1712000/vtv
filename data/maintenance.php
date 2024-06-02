<?php
    // $v = 6.18;
    $v = 5.397;
    $sessionDuration = 60*60;
    $title = basename(dirname(__DIR__));

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