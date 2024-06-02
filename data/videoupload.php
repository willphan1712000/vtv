<?php
include "core.php";
$conn = Database::connection();
$videoFile = $_FILES['tvinpFile']['tmp_name'];
$duration = $_POST['duration'];
$newName = $_POST['filename'];
$location = "../upload/".$newName;
if(move_uploaded_file($videoFile, $location)) {
    mysqli_query($conn, "INSERT INTO tvfile VALUES('$newName', '$duration')");
}