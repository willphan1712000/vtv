<?php
    include "connection.php";
    $json = file_get_contents("php://input");
    $body = json_decode($json);
    $tvimage = $body->name;
    $location = "../admin/upload/$tvimage";
    file_put_contents($location, base64_decode($body->body));
    mysqli_query($conn, "INSERT INTO tvfile VALUES('$tvimage', '0')");
?>