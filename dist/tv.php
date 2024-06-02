<?php
$conn = Database::connection();
$g = SystemConfig::globalVariables();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?=$g['title'];?></title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script defer src="/dist/tv6eaef5954db4706c0773.js"></script></head>
<body style="overflow: hidden;">
    <div class="loading" style="position: absolute; width: 100vw; height: 100vh; display: flex;justify-content: center; align-items: center; transition: all .3s"><p>Loading</p></div>
    <div class="warning" style="position: absolute; width: 100vw; height: 100vh; display: none;justify-content: center; align-items: center; transition: all .3s; flex-direction: column"><p>Please update time and theme before proceeding this</p><div class="refresh" style="margin-top: 20px; background-color: #f0f0f0; border-radius: 10px; padding: 15px; cursor: pointer;">Refresh</div></div>
    <div id="tvScreen"></div>
    <div id="detail"></div>
    <p id="networkStatus"></p>
    <script>
        var id = "<?=$g['title'];?>";
    </script>
</body>
</html>