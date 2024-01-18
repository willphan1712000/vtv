<?php
   include "connection.php";
   $result = mysqli_query($conn, "SELECT *FROM tvfile ORDER BY rand()");
   $tvimage = array();
   while($row = mysqli_fetch_array($result)) {
      $tvimage[] = $row;
   }
   echo json_encode($tvimage);
?>