<?php
include "core.php";
$conn = Database::connection();
$obj = new stdClass();
$subsQuery = mysqli_query($conn, "SELECT *FROM subscription");
$obj->subs = mysqli_fetch_assoc($subsQuery)['date'];
// $featuresQuery = mysqli_query($conn, "SELECT *FROM features");
// while($row = mysqli_fetch_assoc($featuresQuery)) {
//     $name = $row['name'];
//     $obj->$name = $row['status'];
// }
echo json_encode($obj);
