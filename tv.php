<?php
include "data/connection.php";
include "data/maintenance.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title?></title>
    <link rel="stylesheet" type="text/css" href="/css/universal.css?v=<?php echo $v;?>">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>
<body style="overflow: hidden;">
    <div class="loading" style="position: absolute; width: 100vw; height: 100vh; display: flex;justify-content: center; align-items: center; transition: all .3s"><p>Loading</p></div>
    <div id="tvScreen"></div>
    <div id="detail"></div>
    <p id="networkStatus"></p>
    <script>
        var id = "<?=$title;?>";
    </script>
    <script src="/js/linkedList.js"></script>
    <script src="/js/checkSubs.js?v=<?php echo $v;?>"></script>
    <script src="js/getTheme.js?v=<?php echo $v;?>"></script>
    <script src="js/preventDefault.js?v=<?php echo $v;?>"></script>
</body>
</html>