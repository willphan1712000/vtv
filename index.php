<?php
include "data/connection.php";
$result = mysqli_query($conn, "SELECT *FROM login");
$login = mysqli_fetch_array($result);
SESSION_START();
// Current user login
if (isset($_SESSION['username'])) {
	header("Location: admin/admin.php");
} else {
	if (isset($_POST['submit'])) {
		$username = $_POST['username'];
		$password = $_POST['password'];
		$error = "";
		if ($username == '' && $password == '') {
			echo '<p class="alert">Username and Password are empty</p>';
			$error = "Username and Password are empty";
		}
		else {
			if ($username == '' || $password == '')
			$error = "Username or Password is empty";
			else {
				if ($username == $login['owner'] && $password == $login['password']) {
					header("Location: admin/admin.php");
					$_SESSION['username'] = $_POST['username'];
					$_SESSION['last_time_admin'] = time();
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
	<link rel="stylesheet" type="text/css" href="css/login.css?v=<?php echo $v;?>">
	<link rel="stylesheet" type="text/css" href="css/universal.css?v=<?php echo $v;?>">
	<title>Log in</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="https://kit.fontawesome.com/960d33c629.js" crossorigin="anonymous"></script>
</head>
<body>
	<div class="login_parent">
		<img src="../img/backgroundLogin.jpg?v=<?php echo $v;?>">
		<div class="login_container">
			<div class="login_design">
				<div class="login_design__logo">
				<?php
					$identityQueryResult = mysqli_fetch_array(mysqli_query($conn, "SELECT *FROM identity"));
					echo '<img src="/img/'.$identityQueryResult['logo'].'?v='.$v.'">';
				?>
				</div>
			</div>
			<div class="login_box">
				<div class="header">
					<h3>Welcome to <?php echo $title;?></h3>
				</div>
				<div class="login">
					<p class="alert"><?=$error;?></p>
					<form action="" method="POST">
						<div>
							<input type="text" name="username" placeholder="Username">
						</div>
						<div>
							<input type="password" name="password" placeholder="Password" autocomplete="on">
						</div>
						<button type="submit" name="submit">Log In</button></div>
					</form>
				</div>
			</div>
		</div>
	</div>
	<script>
		if (window.innerWidth > 510) {
			window.location = "/tv.php";
		}
		var type = 'loginPage'
	</script>
	<script type="module" src="/js/main.js?v=<?=$v;?>"></script>
</body>
</html>