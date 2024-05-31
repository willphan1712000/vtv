<?php
include "connection.php";
if(!isset($_POST['theme']) && !(isset($_POST['color']) && isset($_POST['detail']))) {
    $themeQuery = mysqli_query($conn, "SELECT *FROM theme");
    $data = [];
    while($row = mysqli_fetch_array($themeQuery)) {
        $data[] = $row;
    }
    echo json_encode($data);
}
elseif ((isset($_POST['color']) && isset($_POST['detail'])) && !isset($_POST['theme'])) {
    $color = $_POST['color'];
    $detail = $_POST['detail'];
    mysqli_query($conn, "DELETE FROM theme");
    mysqli_query($conn, "INSERT INTO theme VALUES('-1', '$detail', '$color')");
    // mysqli_query($conn, "UPDATE theme SET detail = '$detail', bgcolor = '$color'");
}
elseif (isset($_POST['theme']) && !(isset($_POST['color']) && isset($_POST['detail']))) {
    $theme = $_POST['theme'];
    $query = mysqli_query($conn, "SELECT *FROM theme");
    $data = array();
    while($row = mysqli_fetch_array($query)) {
        $data[] = $row;
    }
    if(empty($data)) {
        mysqli_query($conn, "INSERT INTO theme VALUES('$theme', 'null', 'null')");
    } else {
        mysqli_query($conn, "UPDATE theme SET theme = '$theme'");
    }
}