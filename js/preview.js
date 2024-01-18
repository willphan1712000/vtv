function initialFetch() {
    let data = {
        color: "",
        detail: ""
    }
    $.ajax({
        url: "/data/theme.php",
        method: "GET",
        dataType: "json",
        success: function(e) {
            if(e.length == 0) {
                $(".theme__option").append('<p><i class="fa-solid fa-circle-exclamation"></i> No Template</p>');
                $(".preview").css("display", "flex");
                $(".theme__option .loader").hide();
            } else {
                // Function fetches Theme, Img, Logo, Bgcolor, Detail
                function img() {
                    return new Promise((res, rej) => {
                        if(e[0].bgcolor === 'null' || e[0].bgcolor === undefined) {
                            data.color = '#fff'
                        } else {
                            data.color = e[0].bgcolor;
                        }
                        if(e[0].detail === 'null' || e[0].detail === undefined) {
                            data.detail = "none";
                        } else {
                            data.detail = e[0].detail
                        }
                        $(".theme__option").addClass("theme__option--" + e[0].theme);
                        $(".theme__option .theme-data").load("/theme/" + e[0].theme + "/index.txt", function() {
                            const $slider = $(".theme__option .theme-data .slider");
                            const $left = $(".theme__option .theme-data .textSlider__left");
                            const $right = $(".theme__option .theme-data .textSlider__right");
                            $left.css("background-color", data.color);
                            $right.css("background-color", data.color);
                            $(".preview .theme-data .wave-area .parallax > use").css("fill", data.color);
                            if(data.detail != "none") {
                                $(".theme__option .detail-data").load("/detail/" + data.detail + "/index.txt");
                            }
                            $.post("/data/imgAdmin.php", {
                                req: "single"
                            }, function(e) {
                                const arrPreview = JSON.parse(e);
                                const count = [];
                                if(arrPreview[1] !== null) {
                                    const ext = arrPreview[1].filename.split(".")[1]
                                    if(ext === 'MOV' || ext === 'MP4') {
                                        $slider.append('<video autoplay="autoplay" muted loop playsinline src="upload/'+arrPreview[1].filename+'"></video>');
                                        $slider.children().on("loadeddata", () => {
                                            count.push("");
                                        })
                                    } else {
                                        $slider.append('<img src="/admin/upload/'+arrPreview[1].filename+'">');
                                        $slider.children().on("load", () => {
                                            count.push("");
                                        })
                                    }
                                } else {
                                    $slider.append('<p><i class="fa-solid fa-circle-exclamation"></i> No image/video</p>')
                                    count.push("");
                                }
                                if(arrPreview[0] != null && arrPreview[0] != '0') {
                                    $left.append('<img src="/img/'+arrPreview[0]+'">');
                                    $left.children().on("load", () => {
                                        count.push("");
                                    })
                                    $right.append('<img src="/img/'+arrPreview[0]+'">');
                                    $right.children().on("load", () => {
                                        count.push("");
                                    })
                                } else {
                                    $left.append('<p><i class="fa-solid fa-circle-exclamation"></i> No logo</p>');
                                    $right.append('<p><i class="fa-solid fa-circle-exclamation"></i> No logo</p>');
                                    count.push("", "");
                                }
                                
                                setInterval(()=>{
                                    if(count.length === 3) {
                                        res();
                                    }
                                }, 500)
                            });
                            // TV COLOR PREVIEW
                            $('.bg__colorTable--tv input[name="tvradio"]').on("click",()=>{
                                $(".preview .theme-data .textSlider__left").css("background-color", $('.bg__colorTable--tv input[name="tvradio"]:checked').val());
                                $(".preview .theme-data .textSlider__right").css("background-color", $('.bg__colorTable--tv input[name="tvradio"]:checked').val());
                                $(".preview .theme-data .wave-area .parallax > use").css("fill", $('.bg__colorTable--tv input[name="tvradio"]:checked').val());
                            })
                            // DETAIL PREVIEW
                            $('.detail-list input[name="tvradio"]').click(function() {
                                let chosen = $(this).val();
                                if(chosen != "none") {
                                    $(".theme__option .detail-data").load("/detail/"+chosen+"/index.txt")
                                } else {
                                    $(".theme__option .detail-data").empty()
                                }
                            })
                        });
                    })
                }
                async function imgHandler() {
                    const response = await img();
                    $(".theme__option .theme-data").addClass("show");
                    $(".theme__option .loader").hide();
                }
                imgHandler();
            }
        }
    })
}

// FETCH IMAGES
function fetchImages() {
    const $imageBlock = $(".tv__uploaded_box .image_block");
    $.post("/data/imgAdmin.php", {
        req: "multi"
    }, function(e) {
        const data = JSON.parse(e);
        for(let i = 0; i < data.length; i++) {
            const ext = data[i].filename.split(".")[1]
            if(ext === 'MP4' || ext === 'MOV') {
                $imageBlock.append('<div class="element"><video autoplay="autoplay" muted loop playsinline src="upload/'+data[i].filename+'"></video><form action="" method="POST"><input type="hidden" name="delete_img_name" value="' + data[i].filename + '"><button class="delete_btn" type="delete" name="tvdelete"><i class="fa-solid fa-x"></i></button></form></div>')
            } else {
                $imageBlock.append('<div class="element"><img src="upload/' + data[i].filename + '"><form action="" method="POST"><input type="hidden" name="delete_img_name" value="' + data[i].filename + '"><button class="delete_btn" type="delete" name="tvdelete"><i class="fa-solid fa-x"></i></button></form></div>');
            }
        }
        $(".count").html(data.length);
        $(".delete_btn").on("click", function(e) {
            e.preventDefault();
            var filename = $(this).prev().val();
            $.post("/data/delete.php", {
                filename: filename,
                req: 'single'
            }, function() {
                $imageBlock.empty();
                $(".submit_box .submit_box--tv").show();
                $(".submit_box .reachMessage").hide();
                fetchImages();
            });
        })
    })
}

// COLOR TABLE
function colorTable() {
    var colorArray = ["#000000","#545454","#737373","#a6a6a6", "#d9d9d9","#ffffff","#ff1717", "#ff5756","#fd66c3","#ca6ce6", "#8c52fe","#5d17eb","#04979e", "#00c2cb","#5ce1e6","#39b5ff", "#5172ff","#004aab","#008036", "#7dd857","#c8e265","#fedd58","#ffbc59","#ff904e"];
    let i = 0, numberOfColor = colorArray.length;
    while(i < numberOfColor) {
        document.querySelector('.bg__colorTable--tv').appendChild(document.createElement("label"));
        i++;
    }
    var label = document.querySelectorAll(".bg__colorTable--tv label");
    for (i = 0; i < label.length; i++) {
        label[i].appendChild(document.createElement("input"));
        label[i].appendChild(document.createElement("div"));
        label[i].classList.add("radio__label");
    }
    var input = document.querySelectorAll(".bg__colorTable--tv .radio__label input");
    for (i = 0; i < input.length; i++) {
        input[i].type = "radio";
        input[i].name = "tvradio";
        input[i].value = colorArray[i];
        input[i].classList.add("radio__input");
    }
    var div = document.querySelectorAll(".bg__colorTable--tv .radio__label div");
    for (i = 0; i < div.length; i++){
        div[i].classList.add("radio__custom");
        div[i].style.backgroundColor = colorArray[i];
    }
}

// DETAIL
function detail() {
    var detailArray = ["none", "heart", "star", "shooting", "flowing"];
    let i = 0, numberOfColor = detailArray.length;
    while(i < numberOfColor) {
        document.querySelector('.detail-list').appendChild(document.createElement("label"));
        i++;
    }
    var label = document.querySelectorAll(".detail-list label");
    for (i = 0; i < label.length; i++) {
        label[i].appendChild(document.createElement("input"));
        label[i].appendChild(document.createElement("div"));
        label[i].classList.add("radio__label");
    }
    var input = document.querySelectorAll(".detail-list .radio__label input");
    for (i = 0; i < input.length; i++) {
        input[i].type = "radio";
        input[i].name = "tvradio";
        input[i].value = detailArray[i];
        input[i].classList.add("radio__input");
    }
    var div = document.querySelectorAll(".detail-list .radio__label div");
    for (i = 0; i < div.length; i++){
        div[i].classList.add("radio__custom");
        if(detailArray[i] != "none") {
            div[i].innerHTML = '<img src="/detail/'+detailArray[i]+'/'+detailArray[i]+'.png?v='+version+'" style="width:100%; height: 100%;">';
        } else {
            div[i].innerHTML = '<img src="/img/none.png" style="width: 100%;">';
        }
    }
}

// MODIFY TEMPLATE PROCESS
function modifyTemplateProcess() {
    let data = {
        color: "",
        detail: ""
    }
    const $modifyBtn = $(".template__modify--btn");
    const $modifyColor = $(".template__modify--color");
    const $modifyDetail = $(".template__modify--detail");
    const $modifyBackToOriginal = $(".template__modify--color .back-to-original");
    const $modifyNextToDetail = $(".template__modify--color .next-to-detail");
    const $modifyBackToColor = $(".template__modify--detail .back-to-color");
    const $modifyConfirm = $(".template__modify--detail .template__modify--confirm");
    $modifyBtn.click(function() {
        $(this).hide();
        $modifyColor.css("display", "flex");
    })
    $modifyBackToOriginal.click(function() {
        $modifyColor.hide();
        $modifyBtn.css("display", "flex");
    })
    $modifyNextToDetail.click(function() {
        $modifyColor.hide();
        $modifyDetail.css("display", "flex");
    })
    $modifyBackToColor.click(function() {
        $modifyDetail.hide();
        $modifyColor.css("display", "flex");
    })
    $('.bg__colorTable--tv input[name="tvradio"]').click(function(){
        data.color = $(this).val();
    })
    $('.detail-list input[name="tvradio"]').click(function() {
        data.detail = $(this).val()
    })
    $modifyConfirm.click(function() {
        $.post("/data/theme.php", data, ()=>{
            $modifyDetail.hide()
            $modifyBtn.css("display", "flex");
            $modifyBtn.children().html('<i class="fa-solid fa-circle-check" style="font-size: 25px; color: green; margin-right: 5px;"></i> Modified')
            setTimeout(()=>{
                $modifyBtn.children().html('Modify Template')
            }, 1200)
        })
    })
}

export { initialFetch, fetchImages, colorTable, detail, modifyTemplateProcess }