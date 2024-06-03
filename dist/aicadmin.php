<?php
// Upload image name to database and image file to a certain folder
// Include all necessary files
$conn = Database::connection();
$g = SystemConfig::globalVariables();
// Page Session
SESSION_START();
if(isset($_SESSION['aicusername'])) {
	if (time() - $_SESSION['last_time_aicadmin'] > $g['sessionDuration']) {
		header("Location: /expire");
		unset($_SESSION['aicusername']);
	} else {
		$_SESSION['last_time_aicadmin'] = time();
	}
}
else {
	header("Location: /aicadmin");
}
// Logo upload
if(isset($_POST["logo"])) {
	$name = $_FILES['file']['name'];
	$tmp_name = $_FILES['file']['tmp_name'];
	$error = $_FILES['file']['error'];
	$size = $_FILES['file']['size'];

	$fileExt = explode(".",$name);
	$fileActualExt = strtolower(end($fileExt));

	$ExtAllowed = array('jpg', 'jpeg', 'png', 'pdf');
	$msgLogo = "";
	if (in_array($fileActualExt, $ExtAllowed)) {
		if ($error === 0) {
			if ($size < 5000000) {
				$fileNameNew = uniqid('', true).".".$fileActualExt;
				$fileLocation = "./img/logo/".$fileNameNew;
                if (move_uploaded_file($tmp_name, $fileLocation)) {
                    $identity = mysqli_query($conn, "SELECT * FROM identity");
					$arr = mysqli_fetch_assoc($identity);
					$prevLogo = $arr['logo'];
					$color = $arr['color'];
                    if ($prevLogo === NULL && $color === NULL) {
                        mysqli_query($conn, "INSERT INTO identity VALUES('0', '$fileNameNew')");
                    } else {
                        mysqli_query($conn, "UPDATE identity SET logo = '$fileNameNew' WHERE color = '$color'");
                        unlink("./img/logo/".$prevLogo);
                    }
					$msgLogo = "Logo has been uploaded successfully";
                } else {
					$msgLogo = "There was a problem uploading the file";
                }
				
				
			}
			else {
				$msgLogo = "The image should be less than 5MB";
			}
		}
		else {
			$msgLogo = "There was an error";
		}
	}
	else {
		$msgLogo = "The extension of the image is not allowed";
	}
}
// Set color concept
if (isset($_POST['concept'])) {
	$msgColor = "";
	if (isset($_POST['tvradio'])) {
		$concept = $_POST['tvradio'];
	} else {
		$concept = array();
	}
	if (empty($concept)) {
		$msgColor = "Please select a color";
	} else {
		$identity = mysqli_query($conn, "SELECT * FROM identity");
		$arr = mysqli_fetch_assoc($identity);
		$prevLogo = $arr['logo'];
		$color = $arr['color'];
		if ($prevLogo === NULL && $color === NULL) {
			mysqli_query($conn, "INSERT INTO identity VALUES ('$concept', '0')");
			$msgColor = "Color has been set successfully";
		} else {
			mysqli_query($conn, "UPDATE identity SET color = '$concept' WHERE logo = '$prevLogo'");
			$msgColor = "Color has been set successfully";
		}
	}
}
// Logout
if(isset($_POST['logOut'])) {
	header("Location: /logout");
	unset($_SESSION['aicusername']);
}
// Fetch time
$queryTime = mysqli_query($conn, "SELECT *FROM time");
while($row = mysqli_fetch_array($queryTime)) {
	$timeInterval = $row['time'];
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
<script defer src="/dist/mainafa4b313f43ffd7fa3c1.js"></script><script defer src="/dist/admine5ad41092755f018a3c1.js"></script><script defer src="/dist/aicstyle63523c906903802b6529.js"></script><script defer src="/dist/universal900bc0c532bedfdccd93.js"></script></head>
<body>
	<!-- ========== Uploading Progress ========== -->
	<div id = "uploadingArea">
		<div class = "uploadingBox">
			<label for="progressBar"></label>
			<progress value = "0" max = "100"></progress>
		</div>
	</div>
	<div id = "admin">
		<div class="dashboard">
			<h3>TV 1 ADMIN</h3>
			<div class="dash_btn__area">
				<div class="dash_logo__area">
                    <?php
                        $identityQueryResult = mysqli_fetch_array(mysqli_query($conn, "SELECT *FROM identity"));
                        echo '<img src="/img/logo/'.$identityQueryResult['logo'].'?v='.$g['v'].'">';
                    ?>
				</div>
				<form action="" method="POST" enctype="multipart/form-data">
						<button class="dash_btn" type="submit" name="logOut">Log out</button>
				</form>
			</div>
		</div>
		<div class="functions">
            <!-- ============ OWNER ACCOUNT ============= -->
			<div class="box owner_box">
				<div></div>
				<h3>Set Owner Account</h3>
				<div class="owner_box--block">
					<div class="set">
						<form action="" method="POST">
							<input type="text" name="owner" placeholder="Enter Owner Username"></br></br>
							<div class="password--block">
							<input type="password" name="password" placeholder="Enter Owner Password"><i class="fa-solid fa-eye active"></i>
							</div></br>
							<input type="password" name="re_password" placeholder="Re-enter Owner Password"></br></br>
							<button class="btn" type="submit" name="setOwner">Apply</button>
						</form>
					</div>
					<div class="box display">
						<h4>Current Owner Account</h4><p>Username: </p><p></p><p>Password: </p><p></p>
					</div>
				</div>
			</div>
			<div class="box owner_logo">
				<div></div>
				<h3>Upload Logo Image (Should be transparent)</h3>
				<p style="color: green; margin-bottom: 15px;"><?=$msgLogo;?></p>
				<form action="" method="POST" enctype="multipart/form-data">
					<input type="file" name="file" accept="image/* ">
					<button class="btn" type="submit" name="logo">Upload</button>
				</form>
			</div>
			<div class="box owner_color">
				<h3>Set Color Concept</h3>
				<p style="color: green; margin-bottom: 15px;"><?=$msgColor;?></p>
				<form action="" method="POST">
					<div class="concept color-table" style="width: 100%;"></div>
					<button class="btn" name="concept" type="submit">Apply</button>
				</form>
			</div>
			<div class="box time-interval">
				<h3>Time Interval</h3>
				<p><i style="color: green;"class="fa-solid fa-circle-check"></i>   Time interval has been set to 
				<span> <?=$timeInterval;?> </span>
				second(s)</p>
				<form action="" method="POST">
					<input type="text" name="timeInterval" placeholder="Time is Integer" required pattern = "\d+">
					<button class="btn" name="timeBtn" type="submit">Apply</button>
				</form>
			</div>
			<div class="footer">
				<form action="" method="POST">
					<button class="ft_btn" type="submit" name="logOut">LOG OUT</button>
				</form>
			</div>
		</div>
	</div>
	<div id="copyright">
		<p><?=$g['license'];?></p>
	</div>
	<script>
		var id = "<?= $g['title'];?>"
		var type = "aicadmin"
	</script>
</body>
</html>