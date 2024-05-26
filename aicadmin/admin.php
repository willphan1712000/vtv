<?php
// Upload image name to database and image file to a certain folder
// Include all necessary files
include "../data/connection.php";
// Page Session
SESSION_START();
if(isset($_SESSION['aicusername'])) {
	if (time() - $_SESSION['last_time_aicadmin'] > $sessionDuration) {
		header("Location: ../admin/sessionExpired.php");
		unset($_SESSION['aicusername']);
	} else {
		$_SESSION['last_time_aicadmin'] = time();
	}
}
else {
	header("Location: ./");
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
	if (in_array($fileActualExt, $ExtAllowed)) {
		if ($error === 0) {
			if ($size < 5000000) {
				$fileNameNew = uniqid('', true).".".$fileActualExt;
				if(!is_dir("../img/logo")) {
					mkdir("../img/logo", 0755, true);
				}
				$fileLocation = "../img/logo/".$fileNameNew;
                if (move_uploaded_file($tmp_name, $fileLocation)) {
                    $logo = mysqli_query($conn, "SELECT * FROM identity");
					$prevLogo = mysqli_fetch_assoc($logo)['logo'];
                    if (mysqli_fetch_assoc($logo)['logo'] == NULL) {
                        mysqli_query($conn, "INSERT INTO identity VALUES('0', '$fileNameNew')");
                    } else {
                        mysqli_query($conn, "UPDATE identity SET logo = '$fileNameNew'");
                        unlink("../img/logo/".$prevLogo);
                    }
                    echo '<p class="alert">Logo has been uploaded successfully</p>';
                } else {
                    echo '<p class="alert">There was a problem uploading the file</p>';
                }
				
				
			}
			else {
				echo '<p class="alert">The image should be less than 5MB</p>';
			}
		}
		else {
			echo '<p class="alert">there was an error</p>';
		}
	}
	else {
		echo '<p class="alert">The extension of the image is not allowed</p>';
	}
}
// Set color concept
if (isset($_POST['concept'])) {
	if (isset($_POST['tvradio'])) {
		$concept = $_POST['tvradio'];
	} else {
		$concept = array();
	}
	if (empty($concept)) {
		echo '<p class="alert">Please select a color</p>';
	} else {
		$color = mysqli_query($conn, "SELECT color FROM identity ");
		if (mysqli_fetch_array($color)['color'] == NULL) {
			mysqli_query($conn, "INSERT INTO identity VALUES ('$concept', '0')");
		} else {
			mysqli_query($conn, "UPDATE identity SET color = '$concept'");
		}
	}
}
// Logout
if(isset($_POST['logOut'])) {
	header("Location: ../admin/logOutPage.php");
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
	<link rel="stylesheet" type="text/css" href="../css/admin.css?v=<?=$v;?>">
	<link rel="stylesheet" type="text/css" href="../css/universal.css?v=<?=$v;?>">
	<link rel="stylesheet" type="text/css" href="../css/aicstyle.css?v=<?=$v;?>">
	<title>Admin</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://kit.fontawesome.com/960d33c629.js" crossorigin="anonymous"></script>
</head>
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
                        echo '<img src="/img/logo/'.$identityQueryResult['logo'].'?v='.$v.'">';
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
				<form action="" method="POST" enctype="multipart/form-data">
					<input type="file" name="file" accept="image/* ">
					<button class="btn" type="submit" name="logo">Upload</button>
				</form>
			</div>
			<div class="box owner_color">
				<h3>Set Color Concept</h3>
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
		<p>© <?=$year?> All in Click, LLC. All rights reserved.</p>
	</div>
	<script>
		var id = "<?= $title;?>"
		var type = "aicadmin"
	</script>
	<script type="module" src="/js/main.js?v=<?=$v;?>"></script>
</body>
</html>