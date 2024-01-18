$(document).ready(function() {
    $.ajax({
        url: "/data/checkSubs.php",
        method: "GET",
        dataType: "json",
        success: function(e) {
            checkSubs(e.subs);
        }
    })
    function checkSubs(when) {
        const d = new Date();
        const expiration = new Date(formattingDate(when));
        if(d.getTime() < expiration.getTime() || when === null) {
            window.location = "/";
        }
    }
    function formattingDate(date) {
        return date + " 00:00:00";
    }
})