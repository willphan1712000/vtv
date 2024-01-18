<?php
// of = obtained features
include "connection.php";
class Feature {
    public $time;
    public $theme;
    public $detail;
    public $bgcolor;
    public $mode;
    public $img;
    function set($time, $theme, $detail, $bgcolor, $mode, $img) {
        $this->time = $time;
        $this->theme = $theme;
        $this->detail = $detail;
        $this->bgcolor = $bgcolor;
        $this->mode = $mode;
        $this->img = $img;
    }
}
$feature = new Feature();
$timeArray = mysqli_fetch_assoc(mysqli_query($conn, "select *from time"));
$themeArray = mysqli_fetch_assoc(mysqli_query($conn, "select *from theme"));
$imgArrayQuery = mysqli_query($conn, "select *from tvfile");
$modeArray = mysqli_fetch_assoc(mysqli_query($conn, "select *from manualslidingmode"));
$imgArray = array();
while($row = mysqli_fetch_assoc($imgArrayQuery)) {
    $imgArray[] = $row;
}
$feature->set($timeArray['time'],$themeArray['theme'],$themeArray['detail'],$themeArray['bgcolor'],$modeArray['turnon'], $imgArray);
echo json_encode($feature);