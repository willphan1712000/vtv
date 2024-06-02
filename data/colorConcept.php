<?php
    include "core.php";
    $conn = Database::connection();
    $color = mysqli_query($conn, "SELECT *FROM identity");
    $color = mysqli_fetch_array($color)['color'];
    echo $color;
?>