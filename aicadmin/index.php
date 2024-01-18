<?php
include "../data/connection.php";
$result = mysqli_query($conn, "SELECT *FROM login");
$login = mysqli_fetch_array($result);
SESSION_START();
if (isset($_SESSION['aicusername'])) {
	header("Location: admin.php");
} else {
	if (isset($_POST['submit'])) {
		$username = $_POST['username'];
		$password = $_POST['password'];
		$error = "";
		if ($username == '' && $password == '') {
			$error = "Username and Password are empty";
		}
		else {
			if ($username == '' || $password == '')
			$error = "Username or Password is empty";
			else {
				if ($username == 'Allinclicks' && $password == '123456') {
					header("Location: admin.php");
					$_SESSION['aicusername'] = $_POST['username'];
					$_SESSION['last_time_aicadmin'] = time();
				}
				else {
					$error = "Username or Password is incorrect";
				}
			}
		}
	}
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" type="text/css" href="../css/login.css?v=<?php echo $v;?>">
	<link rel="stylesheet" type="text/css" href="../css/universal.css?v=<?php echo $v;?>">
	<title>Log in</title>
</head>
<body>
	<div class="login_parent">
		<img src="../img/backgroundLogin.jpg?v=<?php echo $v;?>">
		<div class="login_container">
			<div class="login_design">
				<div class="login_design__logo">
					<img src="/img/allinclicks.png">
					<h3>Allinclicks</h3>
				</div>
			</div>
			<div class="login_box">
				<div class="header">
					<h3>TV Admin</h3>
				</div>
				<div class="login login_cur">
					<p class="alert"><?=$error;?></p>
					<form action="" method="POST">
						<div>
							<input type="text" name="username" placeholder="Username">
						</div>
						<div>
							<input type="password" name="password" placeholder="Password" autocomplete="on">
						</div>
						<button type="submit" name="submit">Log In</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	<script src="/js/preventDefault.js?v=<?php echo $v;?>"></script>
</body>
</html>