<?php
$conn = Database::connection();
$g = SystemConfig::globalVariables();
$result = mysqli_query($conn, "SELECT *FROM login");
$login = mysqli_fetch_array($result);
SESSION_START();
// Current user login
if (isset($_SESSION['username'])) {
	header("Location: /admin");
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
				if ($username == $login['owner'] && $password == $login['password']) {
					header("Location: /admin");
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
<html lang="en"><head><script defer src="/dist/main1afe1dd4fd3bde2b3d71.js"></script><script defer src="/dist/login911b6b306c5b30f04197.js"></script><script defer src="/dist/universal900bc0c532bedfdccd93.js"></script></head>
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Log in</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="https://kit.fontawesome.com/960d33c629.js" crossorigin="anonymous"></script>
<body>
	<div class="login_parent">
		<div class="login_container">
			<div class="login_design">
				<div class="login_design__logo">
				<?php
					$identityQueryResult = mysqli_fetch_array(mysqli_query($conn, "SELECT *FROM identity"));
					echo '<img src="/img/logo/'.$identityQueryResult['logo'].'?v='.$v.'">';
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
							<input type="text" name="username" placeholder="Username" value="<?=$username;?>">
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
		var type = 'loginPage'
	</script>
</body>
</html>