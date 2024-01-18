<?php
    include "connection.php";
    if(isset($_POST['req'])) {
        $req = $_POST['req'];
        $query = mysqli_query($conn, "SELECT *FROM tvfile ORDER BY rand()");
        $arr = array();
        while($row = mysqli_fetch_array($query)) {
            $arr[] = $row;
        }
        if($req === "multi") {
            echo json_encode($arr);
        } 
        else {
            $arrPreview = array(mysqli_fetch_array(mysqli_query($conn, "SELECT *FROM identity"))[1], $arr[0]);
            echo json_encode($arrPreview);
        }
    }
?>