<?php
include "connection.php";
$logoQeury = mysqli_query($conn, "SELECT logo FROM identity");
echo mysqli_fetch_array($logoQeury)[0];