<?php
include "connection.php";
if(isset($_POST['req'])) {
    if($_POST['req'] == 'single') {
        $filename = $_POST['filename'];
        mysqli_query($conn, "DELETE FROM tvfile WHERE filename = '$filename'");
        unlink("../admin/upload/".$filename);
    } else if ($_POST['req'] == 'multi') {
        $videos = json_decode($_POST['filename']);
        foreach($videos as $video) {
            mysqli_query($conn, "DELETE FROM tvfile WHERE filename = '$video'");
            unlink("../admin/upload/".$video);
        }
    }
}