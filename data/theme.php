<?php
include "core.php";
$conn = Database::connection();
if(!isset($_POST['theme']) && !(isset($_POST['color']) && isset($_POST['detail']))) {
    $themeQuery = mysqli_query($conn, "SELECT *FROM theme");
    $data = [];
    while($row = mysqli_fetch_array($themeQuery)) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    $color = $_POST['color'];
    $detail = $_POST['detail'];
    $direciton = $_POST['direction'];
    mysqli_query($conn, "DELETE FROM theme");
    mysqli_query($conn, "INSERT INTO theme VALUES('-1', '$detail', '$color', '$direciton')");
}