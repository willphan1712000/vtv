<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" type="text/css" href="/css/termination.css?v=<?php echo $v;?>">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
   <title>Logged out</title>
</head>
<body>
   <div class="parent">
      <img src="../img/backgroundLogin.jpg?v=<?php echo $v;?>">
      <div class="element">
         <div class="alert">
            <h3>Your session has expired</h3>
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
   <script src="/js/checkSubs.js?v=<?php echo $v;?>"></script>
   <script src="/js/preventDefault.js?v=<?php echo $v;?>"></script>
</body>
</html>