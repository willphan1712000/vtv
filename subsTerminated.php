<?php
include "../maintenance.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Subscription expired</title>
   <link rel="stylesheet" type="text/css" href="/css/termination.css?v=<?php echo $v;?>">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>
<body>
   <div class="parent">
      <div class="background">
         <svg id="visual" viewBox="0 0 675 900" width="675" height="900" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="675" height="900" fill="#ffffff"></rect><defs><linearGradient id="grad1_0" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" stop-color="#ffffff" stop-opacity="1"></stop><stop offset="70%" stop-color="#ffffff" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" stop-color="#ffffff" stop-opacity="1"></stop><stop offset="70%" stop-color="#ffffff" stop-opacity="1"></stop></linearGradient></defs><g transform="translate(675, 0)"><path d="M0 506.3C-71.4 504.4 -142.9 502.6 -193.7 467.7C-244.6 432.8 -274.9 364.8 -314 314C-353 263.1 -400.7 229.3 -434.2 179.9C-467.7 130.4 -487 65.2 -506.2 0L0 0Z" fill="#FBAE3C"></path></g><g transform="translate(0, 900)"><path d="M0 -506.2C71.9 -504.5 143.8 -502.8 193.7 -467.7C243.6 -432.6 271.5 -364.2 315.4 -315.4C359.2 -266.5 419.1 -237.2 453.6 -187.9C488.1 -138.6 497.2 -69.3 506.3 0L0 0Z" fill="#FBAE3C"></path></g></svg>
      </div>
      <div class="element">
         <div class="alert">
            <h3>Your subscription has expired</h3> <h4>Contact us to have more time for Portfolio</h4>
         </div>
      </div>
   </div>
   <script src="/js/colorConcept.js?v=<?php echo $v;?>"></script>
   <script src="/js/subsRenewal.js?v=<?php echo $v;?>" async></script>
</body>
</html>