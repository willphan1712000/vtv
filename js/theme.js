import {theme} from "./preview.js"
const themeObj = theme()
function FetchTheme() {
    this.fetch = function() {
        for(let i = 1; i <= themeObj.numoftheme(); i++) {
            $(".theme_box").append('<div class="theme__option theme__option--'+i+'"><div class="loader"></div><div class="theme-data"></div></div>')
            function img() {
                return new Promise((res, rej)=> {
                    themeObj.addDOM(".theme_box .theme__option--" + i + " .theme-data", i, null)
                    $(".theme__option--" + i + " .theme-data .slider").append('<img src="/img/sliderdemo.png">');
                    $(".theme__option--" + i + " .theme-data .textSlider__left").append('<img src="/img/demo.png">');
                    $(".theme__option--" + i + " .theme-data .textSlider__right").append('<img src="/img/demo.png">');
                    const count = [];
                    $(".theme__option--" + i + " .theme-data img").each(function() {
                        $(this).on("load",() => {
                            count.push("");
                        })
                    })
                    setInterval(()=>{
                        if(count.length === 3) {
                            res();
                        }
                    }, 500)
                })
            }
            async function imgHandler() {
                const response = await img();
                $(".theme__option--" + i + " .theme-data").addClass("show");
                $(".theme__option--" + i + " .loader").hide();
            }
            imgHandler();
            $(".theme_box .theme__option--" + i).append('<div class="select-layer"><button class="selectBtnConfirm" name="'+i+'"><i class="fa-solid fa-circle-check"></i></button></div>');
        }


        $(".select-layer").click(function() {
            $.ajax({
                url: "/data/theme.php",
                method: "GET",
                dataType: "json",
                success: e => {
                    const $apply = $(".apply");
                    if(e[0] !== undefined) {
                        if(!$(this).hasClass("select")) {
                            if($(this).parents().hasClass("theme__option--" + e[0].theme)) {
                                $(".select-layer").removeClass("select");
                                $apply.hide();
                            } else {
                                $(".select-layer").removeClass("select");
                                $(this).addClass("select");
                                $apply.show();
                            }
                        }
                    } 
                    else {
                        $(".select-layer").removeClass("select");
                        $(this).addClass("select");
                        $apply.show();
                    }
                }
            })
        })
        $(".apply").click(e => {
            $(".select-layer").each(function(ele) {
                if($(this).hasClass('select')) {
                    let theme = $(this).find(".selectBtnConfirm").attr('name');
                    $.ajax({
                        url: "/data/theme.php",
                        method: "POST",
                        data: {
                            theme: theme
                        },
                        dataType: "html",
                        success: () => {
                            $('.selectBtnConfirm').hide();
                            $(this).find('.selectBtnConfirm').show('slow');
                        }
                    })
                }
            })
        })
    }
}
var fetchTheme = new FetchTheme();
fetchTheme.fetch();


function FetchChosenTheme(url, method) {
    this.url = url;
    this.method = method;
    this.fetch = function() {
        $.ajax({
            url: this.url,
            method: this.method,
            dataType: "json",
            success: function(e) {
                if(e[0] !== undefined) {
                    $('.theme__option--' + e[0].theme).find('.selectBtnConfirm').show();
                }
            }
        })
    }    
}
var fetchChosenTheme = new FetchChosenTheme("/data/theme.php", "GET");
fetchChosenTheme.fetch();