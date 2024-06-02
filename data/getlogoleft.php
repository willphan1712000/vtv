<?php
include "core.php";
$conn = Database::connection();
$logoQeury = mysqli_query($conn, "SELECT logo FROM identity");
echo mysqli_fetch_array($logoQeury)[0];