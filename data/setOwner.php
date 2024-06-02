<?php
    include "core.php";
    $conn = Database::connection();
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        mysqli_query($conn, "DELETE FROM login");
        mysqli_query($conn, "INSERT INTO login VALUES('$username', '$password')");
    } else {
        $owner = array();
        $result = mysqli_query($conn, "SELECT *FROM login");
        while ($row = mysqli_fetch_array($result)) {
            $owner[] = $row;
        }
        echo json_encode($owner);
    }

?>