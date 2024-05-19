<?php
// Upload image name to database and image file to a certain folder
// Include all necessary files
include "../data/connection.php";
// include "../data/numoftheme.php";
// Page Session
SESSION_START();
if(isset($_SESSION['username'])) {
	if (time() - $_SESSION['last_time_admin'] > $sessionDuration) {
		header("Location: sessionExpired.php");
		unset($_SESSION['username']);
	} else {
		$_SESSION['last_time_admin'] = time();
	}
}
else {
	header("Location: /");
}

// Logout
if(isset($_POST['logOut'])) {
	header("Location: logOutPage.php");
	unset($_SESSION['username']);
}
$countQuery = mysqli_query($conn, "SELECT *FROM tvfile");
$count = 0;
while($row = mysqli_fetch_array($countQuery)) {
	$count++;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
   	<meta http-equiv="Pragma" content="no-cache" />
   	<meta http-equiv="Expires" content="-1"/>
	   <link rel="stylesheet" type="text/css" href="../css/universal.css?v=<?= $v;?>">
	<link rel="stylesheet" type="text/css" href="../css/admin.css?v=<?= $v;?>">
	<link rel="stylesheet" type="text/css" href="../css/theme.css?v=<?= $v;?>">
	<link rel="stylesheet" type="text/css" href="../css/detail.css?v=<?= $v;?>">
	<title>Admin</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="https://kit.fontawesome.com/960d33c629.js" crossorigin="anonymous"></script>
</head>
<body>
	<script>
		var multiImgMax = <?= $multiImgMax;?>, currentImg = <?= $count;?>;
		var id = "<?= $title;?>";
		var version = "<?= $v;?>";
		var copyright  = "<?= $copyright;?>"
		var maxVideoDuration = "<?= $maxVideoDuration;?>"
		var type = "admin"
	</script>
	<script type="module" src="/dist/main.js?v=<?=$v;?>" defer></script>
    <script type="module" src="/js/upload.js?v=<?=$v;?>" defer></script>
</body>
</html>