<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
   <title>Logged out</title>
<script defer src="/dist/main364c2dce59353ab9ad70.js"></script><script defer src="/dist/termination63c3f745a6ad7743f91d.js"></script></head>
<body>
   <div class="parent">
      <img src="../img/backgroundLogin.jpg?v=<?php echo $v;?>">
      <div class="element">
         <div class="alert">
            <h3>You have logged out successfully</h3>
         </div>
         <form action="" method="POST" enctype="multipart/form-data">
            <button class="ft_btn" type="submit" name="backHome">Back to home page</button>
            <?php
               // Back to home page
               if (isset($_POST['backHome'])) {
                  header("Location: /");
               }
            ?>
         </form>
      </div>
   </div>
   <script>
      var type = "logoutPage"
   </script>
</body>
</html>