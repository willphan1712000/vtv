<?php
// fof = frequently obtained features
date_default_timezone_set("America/New_York");
header("Content-Type: text/event-stream");
include "connection.php";
class Feature {
    public $time;
    public $theme;
    public $detail;
    public $bgcolor;
    public $mode;
    public $left;
    public $right;
    public $img;
    function set($time, $theme, $detail, $bgcolor, $mode, $left, $right, $img) {
        // 9 Properties of a feature
        $this->time = $time;
        $this->theme = $theme;
        $this->detail = $detail;
        $this->bgcolor = $bgcolor;
        $this->mode = $mode;
        $this->left = $left;
        $this->right = $right;
        $this->img = $img;
    }
}
$feature = new Feature();
while(1) {
    $timeArray = mysqli_fetch_assoc(mysqli_query($conn, "SELECT *FROM time"));
    $themeArray = mysqli_fetch_assoc(mysqli_query($conn, "SELECT *FROM theme"));
    $modeArray = mysqli_fetch_assoc(mysqli_query($conn, "SELECT *FROM manualslidingmode"));
    $imgArrayQuery = mysqli_query($conn, "SELECT *FROM tvfile");
    $imgArray = array();
    while($row = mysqli_fetch_assoc($imgArrayQuery)) {
        $imgArray[] = $row;
    }
    $feature->set($timeArray['time'],$themeArray['theme'],$themeArray['detail'],$themeArray['bgcolor'],$modeArray['turnon'], $modeArray['prev'], $modeArray['next'], $imgArray);
    echo 'data: '.json_encode($feature), "\n\n";

    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    flush();
    if(connection_aborted()) break;
    sleep(1);
}