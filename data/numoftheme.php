<?php
    // Count the number themes
    $file = scandir("../theme");
    $numoftheme = 0;
    for($i = 0; $i < count($file); $i++) {
       if(preg_match('/\d+/', $file[$i])) {
           $numoftheme++;
       }
    }