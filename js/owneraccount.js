$(document).ready(function(){
    $display = $(".owner_box--block .display").children();
    $(".owner_box [name='setOwner']").click(event=>{
        event.preventDefault();
        $username_box = $(".owner_box [name='owner']");
        $password_box = $(".owner_box [name='password']");
        $re_password_box = $(".owner_box [name='re_password']");
        var username = $username_box.val();
        var password = $password_box.val();
        var re_password = $re_password_box.val();
        if (username === '' && password === '') {
            $(".owner_box").children().first().empty();
            $(".owner_box").children().first().append('<p class="alert">Please enter Username and Password</p>');
            $username_box.addClass("errorFocusActive");
            $password_box.addClass("errorFocusActive");
            $re_password_box.addClass("errorFocusActive");
        } else if (username != '' && password === '') {
            $(".owner_box").children().first().empty();
            $(".owner_box").children().first().append('<p class="alert">Please enter Password</p>');
            $username_box.removeClass("errorFocusActive");
            $password_box.removeClass("errorFocusActive");
            $re_password_box.removeClass("errorFocusActive");
            $password_box.addClass("errorFocusActive");
            $re_password_box.addClass("errorFocusActive");
        } else if (username === '' && password != '') {
            $(".owner_box").children().first().empty();
            $(".owner_box").children().first().append('<p class="alert">Please enter Username</p>');
            $username_box.removeClass("errorFocusActive");
            $password_box.removeClass("errorFocusActive");
            $re_password_box.removeClass("errorFocusActive");
            $username_box.addClass("errorFocusActive");
        } else if (username != '' && password != '' && re_password === '') {
            $(".owner_box").children().first().empty();
            $(".owner_box").children().first().append('<p class="alert">Please re-enter your password</p>');
            $username_box.removeClass("errorFocusActive");
            $password_box.removeClass("errorFocusActive");
            $re_password_box.removeClass("errorFocusActive");
            $re_password_box.addClass("errorFocusActive");
        }
        else {
            if (re_password === password){
                $.post("/data/setOwner.php", {
                    username: username,
                    password: password
                });
                $(".owner_box").children().first().empty();
                $(".owner_box").children().first().append('<p class="alert">Owner Account has been set successfully</p>');
                $username_box.removeClass("errorFocusActive");
                $password_box.removeClass("errorFocusActive");
                $re_password_box.removeClass("errorFocusActive");
                $display.eq(2).html(username);
                $display.eq(4).html(password);
            } else {
                $(".owner_box").children().first().empty();
                $(".owner_box").children().first().append('<p class="alert">Your password is not matched</p>');
                $username_box.removeClass("errorFocusActive");
                $password_box.removeClass("errorFocusActive");
                $re_password_box.removeClass("errorFocusActive");
                $password_box.addClass("errorFocusActive");
                $re_password_box.addClass("errorFocusActive");
            }
        }
    });
    $.getJSON("/data/setOwner.php", function(e) {
        $display.eq(2).html(e[0].owner);
        $display.eq(4).html(e[0].password);
    });
    // Hide and Show Password
    $pw = $(".owner_box--block .set [name='password'], .owner_box--block .set [name='re_password']");
    $eye = $(".owner_box--block .set i");
    $eye.click(()=>{
        if ($pw.attr('type') == "password") {
            $pw.attr('type','text');
            $eye.removeClass("active");
        } else {
            $pw.attr('type','password');
            $eye.addClass("active");
        }
    });
});