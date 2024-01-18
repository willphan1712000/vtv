$(document).ready(function() {
    $controller = $(".manual-controller")
    $check = $(".manual-switch .switch input[type='checkbox']")
    $.getJSON("/data/manualslidingmode.php", function(e) {
        if(e[0].turnon == "true") {
            $check.prop("checked", true)
            $controller.css("display", "flex")
        } else {
            $check.prop("checked", false)
        }
    })
    $(".manual-switch .switch input[type='checkbox']").change(function() {
        if($(this).is(":checked")) {
            $controller.css("display", "flex")
            $.post("/data/manualslidingmode.php", {
                manual: "true"
            })
        } else {
            $controller.hide()
            $.post("/data/manualslidingmode.php", {
                manual: "false"
            })
            
        }
    })
    $(".manual-controller .left").click(() => {
        $.post("/data/manualslidingmode.php", {
            manual: "left" 
        })
    })
    $(".manual-controller .right").click(() => {
        $.post("/data/manualslidingmode.php", {
            manual: "right" 
        })
    })
})