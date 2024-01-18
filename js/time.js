$(document).ready(function() {
    $("button[name='timeBtn']").click(e => {
        e.preventDefault();
        $fetchTimeBox = $(".time-interval p span")
        let time = Number($("input[name='timeInterval']").val());
        if(Number.isInteger(time) && time > 0) {
            $.post("/data/time.php", {
                req: time
            }, function() {
                $fetchTimeBox.html(time)
            })
        } else {
            $fetchTimeBox.html("an error")
        }
    })
})