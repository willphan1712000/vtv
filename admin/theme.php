<?php
include "../data/connection.php";
include "../data/maintenance.php";
include "../data/numoftheme.php";
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
if(isset($_POST['back'])) {
	header("Location: admin.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" type="text/css" href="/css/universal.css?v=<?php echo $v;?>">
	<link rel="stylesheet" type="text/css" href="/css/login.css?v=<?php echo $v;?>">
	<link rel="stylesheet" type="text/css" href="/css/theme.css?v=<?php echo $v;?>">

	<title>Theme</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="https://kit.fontawesome.com/960d33c629.js" crossorigin="anonymous"></script>
</head>
<body>
<div class="login_parent">
		<img src="/img/backgroundLogin.jpg?v=<?php echo $v;?>">
		<div class="theme_box"></div>
        <button class="apply disabled"><i class="fa-solid fa-check"></i>  Apply</button>
        <form action="" method="POST">
            <button class="back" name="back"><i class="fa-solid fa-arrow-left"></i>  Back to admin</button>
        </form>
	</div>
	<script>
		var numoftheme = <?=$numoftheme;?>;
		var id = "<?= $title;?>";
		type = 'theme'
	</script>
	<script type="module" src="/js/main.js?v=<?=$v;?>" defer></script>
    <script src="/js/theme.js?v=<?php echo $v;?>" defer></script>
</body>
</html>