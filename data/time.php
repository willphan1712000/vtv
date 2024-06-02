<?php
    include "core.php";
    $conn = Database::connection();
    if(isset($_POST['req'])) {
        $req = $_POST['req'];
        if (preg_match("/\d+/", $req)) {
            $time = filter_var($req, FILTER_VALIDATE_INT);
            mysqli_query($conn, "DELETE FROM time");
            mysqli_query($conn, "INSERT INTO time VALUES('$time')");
        }
    }
?>