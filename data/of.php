<?php
// of = obtained features
include "core.php";
$conn = Database::connection();
class Feature {
    public $time;
    public $theme;
    public $detail;
    public $direction;
    public $bgcolor;
    public $mode;
    public $img;
    function set($time, $theme, $detail, $direction, $bgcolor, $mode, $img) {
        $this->time = $time;
        $this->theme = $theme;
        $this->detail = $detail;
        $this->direction = $direction;
        $this->bgcolor = $bgcolor;
        $this->mode = $mode;
        $this->img = $img;
    }
}
$feature = new Feature();
$timeArray = mysqli_fetch_assoc(mysqli_query($conn, "SELECT *FROM time"));
$themeArray = mysqli_fetch_assoc(mysqli_query($conn, "SELECT *FROM theme"));
$imgArrayQuery = mysqli_query($conn, "SELECT *FROM tvfile ORDER BY rand()");
$modeArray = mysqli_fetch_assoc(mysqli_query($conn, "SELECT *FROM manualslidingmode"));
$imgArray = array();
while($row = mysqli_fetch_assoc($imgArrayQuery)) {
    $imgArray[] = $row;
}
$feature->set($timeArray['time'],$themeArray['theme'],$themeArray['detail'], $themeArray['direction'], $themeArray['bgcolor'],$modeArray['turnon'], $imgArray);
echo json_encode($feature);