<?php
include "connection.php";
require_once('./getID3-master/getid3/getid3.php');
$videoFile = $_FILES['tvinpFile']['tmp_name'];
$ext = explode(".",  $_FILES['tvinpFile']['name'])[1];
$newName = time().".".$ext;
$location = "../admin/upload/".$newName;
move_uploaded_file($videoFile, $location);
$getID3 = new getID3;
$file = $getID3->analyze($location);
$duration = $file['playtime_seconds'];
mysqli_query($conn, "INSERT INTO tvfile VALUES('$newName', '$duration')");