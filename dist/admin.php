<?php
// Upload image name to database and image file to a certain folder
// Include all necessary files
$conn = Database::connection();
$g = SystemConfig::globalVariables();
// include "../data/numoftheme.php";
// Page Session
SESSION_START();
if(isset($_SESSION['username'])) {
	if (time() - $_SESSION['last_time_admin'] > $g['sessionDuration']) {
		header("Location: /expire");
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
	header("Location: /logout");
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
	<title>Admin</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="https://kit.fontawesome.com/960d33c629.js" crossorigin="anonymous"></script>
<script defer src="/dist/main5343d2e92565003891c2.js"></script><script defer src="/dist/upload5b2bebe12c00625748f8.js"></script><script defer src="/dist/admin0ad1e1688b34d1dc0040.js"></script><script defer src="/dist/themee1bd8361b29db98744b1.js"></script><script defer src="/dist/universal900bc0c532bedfdccd93.js"></script></head>
<body>
	<script>
		var multiImgMax = <?= $g['multiImgMax'];?>;
		var currentImg = <?= $count;?>;
		var id = "<?= $g['title'];?>";
		var version = "<?= $g['v'];?>";
		var copyright  = "<?= $g['license'];?>";
		var maxVideoDuration = "<?= $g['maxVideoDuration'];?>";
		var type = "admin";
	</script>
</body>
</html>