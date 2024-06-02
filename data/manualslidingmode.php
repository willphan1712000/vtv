<?php
include "core.php";
$conn = Database::connection();
if(isset($_POST['manual'])) {
    $manual = $_POST['manual'];
    if($manual === "true" || $manual === "false") {
        mysqli_query($conn, "DELETE FROM manualslidingmode");
        mysqli_query($conn, "INSERT INTO manualslidingmode VALUES('$manual', 'false', 'false')");
    }
    elseif($manual === "left") {
        mysqli_query($conn, "UPDATE manualslidingmode SET prev = 'true'");
    }
    elseif($manual === "right") {
        mysqli_query($conn, "UPDATE manualslidingmode SET next = 'true'");
    }
    elseif($manual === 'leftdone') {
        mysqli_query($conn,  "UPDATE manualslidingmode SET prev = 'false'");
    }
    elseif($manual === 'rightdone') {
        mysqli_query($conn,  "UPDATE manualslidingmode SET next = 'false'");
    }
} else {
    $manualQuery = mysqli_query($conn, "SELECT * FROM manualslidingmode");
    $arr = array();
    while($row = mysqli_fetch_array($manualQuery)) {
        $arr[] = $row;
    }
    echo json_encode($arr);
}