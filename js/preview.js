let data = {
    color: "",
    detail: ""
}
let themeObj = theme(), detailObj = detail()
function initialFetch() {
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
                        themeObj.addDOM(".theme__option .theme-data", e[0].theme, function() {
                            const $slider = $(".theme__option .theme-data .slider");
                            const $left = $(".theme__option .theme-data .textSlider__left");
                            const $right = $(".theme__option .theme-data .textSlider__right");
                            $left.css("background-color", data.color);
                            $right.css("background-color", data.color);
                            $(".preview .theme-data .wave-area .parallax > use").css("fill", data.color)
                            if(data.detail != "none") {
                                detailObj.addDOM(".theme__option .detail-data", data.detail, null)
                            }
                            $.post("/data/imgAdmin.php", {
                                req: "single"
                            }, function(e) {
                                const arrPreview = JSON.parse(e);
                                const count = [];
                                if(arrPreview[1] !== null) {
                                    const ext = arrPreview[1].filename.split(".")[1]
                                    if(ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'avi') {
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
                                    detailObj.addDOM(".theme__option .detail-data", data.detail, null)
                                } else {
                                    $(".theme__option .detail-data").empty()
                                }
                            })
                        })
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
            if(ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'avi') {
                $imageBlock.append('<div class="element"><video autoplay="autoplay" muted loop playsinline src="upload/'+data[i].filename+'"></video><form action="" method="POST"><input type="hidden" name="delete_img_name" value="' + data[i].filename + '"><button class="delete_btn" type="delete" name="tvdelete"><i class="fa-solid fa-x"></i></button><a class="download_btn" download href="/admin/upload/'+data[i].filename+'"><i class="fa-solid fa-arrow-down"></i></a></form></div>')
            } else {
                $imageBlock.append('<div class="element"><img src="upload/' + data[i].filename + '"><form action="" method="POST"><input type="hidden" name="delete_img_name" value="' + data[i].filename + '"><button class="delete_btn" type="delete" name="tvdelete"><i class="fa-solid fa-x"></i></button><a class="download_btn" download href="/admin/upload/'+data[i].filename+'"><i class="fa-solid fa-arrow-down"></i></a></form></div>')
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
function detailCustom() {
    var detailArray = detailObj.detailName;
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
        div[i].innerHTML = '<img src="/img/'+detailObj.image[detailArray[i]]+'?v='+version+'" style="width:100%; height: 100%;">'
    }
}

// MODIFY TEMPLATE PROCESS
function modifyTemplateProcess() {
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
function Detail() {
    this.detailName = ['none', 'flowing', 'heart', 'shooting', 'star']
    this.image = {
        none: 'none.png', 
        flowing: 'flowing.png', 
        heart: 'heart.png', 
        shooting: 'shooting.png',
        star: 'star.png'
    }
    this.index = {
        flowing: `<div class="flowing">
            <span style="--i:10;"></span>
            <span style="--i:12;"></span>
            <span style="--i:13;"></span>
            <span style="--i:9;"></span>
            <span style="--i:10;"></span>
            <span style="--i:13;"></span>
        </div>`,
        heart: `<div class="heart">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="100" height="100" viewBox="0 0 4676.000000 4676.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,4676.000000) scale(0.100000,-0.100000)"
            fill="pink" stroke="none">
            <path d="M17308 34890 c-1031 -49 -2026 -332 -2898 -823 -1733 -978 -2967
            -2741 -3380 -4832 -183 -931 -195 -1946 -35 -2980 150 -964 448 -2005 857
            -2994 1123 -2722 3103 -5295 5838 -7590 1120 -940 2333 -1812 3690 -2653 568
            -352 1433 -852 1910 -1106 l95 -50 145 80 c2656 1459 4771 2953 6610 4667 400
            374 1046 1031 1415 1441 2378 2642 3869 5605 4249 8440 55 411 76 732 76 1180
            0 734 -66 1280 -236 1960 -281 1124 -815 2159 -1563 3025 -121 140 -423 446
            -571 579 -1077 966 -2384 1525 -3833 1640 -1144 91 -2196 -95 -3132 -554 -406
            -199 -768 -435 -1136 -740 -162 -135 -576 -549 -713 -715 -562 -677 -972
            -1417 -1248 -2252 -34 -106 -65 -193 -68 -193 -3 0 -18 44 -34 98 -101 335
            -285 781 -465 1127 -623 1197 -1530 2112 -2642 2664 -879 437 -1858 631 -2931
            581z m1487 -816 c-1010 -298 -2192 -920 -3185 -1675 -1481 -1125 -2690 -2612
            -3534 -4344 -162 -332 -458 -1015 -482 -1112 -22 -88 -24 47 -3 322 99 1347
            507 2662 1150 3712 963 1570 2436 2563 4363 2942 506 100 1117 164 1596 168
            143 2 144 1 95 -13z"/>
            </g>
            </svg>
        </div>
        <div class="heart">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="100" height="100" viewBox="0 0 4676.000000 4676.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,4676.000000) scale(0.100000,-0.100000)"
            fill="pink" stroke="none">
            <path d="M17308 34890 c-1031 -49 -2026 -332 -2898 -823 -1733 -978 -2967
            -2741 -3380 -4832 -183 -931 -195 -1946 -35 -2980 150 -964 448 -2005 857
            -2994 1123 -2722 3103 -5295 5838 -7590 1120 -940 2333 -1812 3690 -2653 568
            -352 1433 -852 1910 -1106 l95 -50 145 80 c2656 1459 4771 2953 6610 4667 400
            374 1046 1031 1415 1441 2378 2642 3869 5605 4249 8440 55 411 76 732 76 1180
            0 734 -66 1280 -236 1960 -281 1124 -815 2159 -1563 3025 -121 140 -423 446
            -571 579 -1077 966 -2384 1525 -3833 1640 -1144 91 -2196 -95 -3132 -554 -406
            -199 -768 -435 -1136 -740 -162 -135 -576 -549 -713 -715 -562 -677 -972
            -1417 -1248 -2252 -34 -106 -65 -193 -68 -193 -3 0 -18 44 -34 98 -101 335
            -285 781 -465 1127 -623 1197 -1530 2112 -2642 2664 -879 437 -1858 631 -2931
            581z m1487 -816 c-1010 -298 -2192 -920 -3185 -1675 -1481 -1125 -2690 -2612
            -3534 -4344 -162 -332 -458 -1015 -482 -1112 -22 -88 -24 47 -3 322 99 1347
            507 2662 1150 3712 963 1570 2436 2563 4363 2942 506 100 1117 164 1596 168
            143 2 144 1 95 -13z"/>
            </g>
            </svg>
        </div>
        <div class="heart">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="100" height="100" viewBox="0 0 4676.000000 4676.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,4676.000000) scale(0.100000,-0.100000)"
            fill="pink" stroke="none">
            <path d="M17308 34890 c-1031 -49 -2026 -332 -2898 -823 -1733 -978 -2967
            -2741 -3380 -4832 -183 -931 -195 -1946 -35 -2980 150 -964 448 -2005 857
            -2994 1123 -2722 3103 -5295 5838 -7590 1120 -940 2333 -1812 3690 -2653 568
            -352 1433 -852 1910 -1106 l95 -50 145 80 c2656 1459 4771 2953 6610 4667 400
            374 1046 1031 1415 1441 2378 2642 3869 5605 4249 8440 55 411 76 732 76 1180
            0 734 -66 1280 -236 1960 -281 1124 -815 2159 -1563 3025 -121 140 -423 446
            -571 579 -1077 966 -2384 1525 -3833 1640 -1144 91 -2196 -95 -3132 -554 -406
            -199 -768 -435 -1136 -740 -162 -135 -576 -549 -713 -715 -562 -677 -972
            -1417 -1248 -2252 -34 -106 -65 -193 -68 -193 -3 0 -18 44 -34 98 -101 335
            -285 781 -465 1127 -623 1197 -1530 2112 -2642 2664 -879 437 -1858 631 -2931
            581z m1487 -816 c-1010 -298 -2192 -920 -3185 -1675 -1481 -1125 -2690 -2612
            -3534 -4344 -162 -332 -458 -1015 -482 -1112 -22 -88 -24 47 -3 322 99 1347
            507 2662 1150 3712 963 1570 2436 2563 4363 2942 506 100 1117 164 1596 168
            143 2 144 1 95 -13z"/>
            </g>
            </svg>
        </div>
        <div class="heart">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="100" height="100" viewBox="0 0 4676.000000 4676.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,4676.000000) scale(0.100000,-0.100000)"
            fill="pink" stroke="none">
            <path d="M17308 34890 c-1031 -49 -2026 -332 -2898 -823 -1733 -978 -2967
            -2741 -3380 -4832 -183 -931 -195 -1946 -35 -2980 150 -964 448 -2005 857
            -2994 1123 -2722 3103 -5295 5838 -7590 1120 -940 2333 -1812 3690 -2653 568
            -352 1433 -852 1910 -1106 l95 -50 145 80 c2656 1459 4771 2953 6610 4667 400
            374 1046 1031 1415 1441 2378 2642 3869 5605 4249 8440 55 411 76 732 76 1180
            0 734 -66 1280 -236 1960 -281 1124 -815 2159 -1563 3025 -121 140 -423 446
            -571 579 -1077 966 -2384 1525 -3833 1640 -1144 91 -2196 -95 -3132 -554 -406
            -199 -768 -435 -1136 -740 -162 -135 -576 -549 -713 -715 -562 -677 -972
            -1417 -1248 -2252 -34 -106 -65 -193 -68 -193 -3 0 -18 44 -34 98 -101 335
            -285 781 -465 1127 -623 1197 -1530 2112 -2642 2664 -879 437 -1858 631 -2931
            581z m1487 -816 c-1010 -298 -2192 -920 -3185 -1675 -1481 -1125 -2690 -2612
            -3534 -4344 -162 -332 -458 -1015 -482 -1112 -22 -88 -24 47 -3 322 99 1347
            507 2662 1150 3712 963 1570 2436 2563 4363 2942 506 100 1117 164 1596 168
            143 2 144 1 95 -13z"/>
            </g>
            </svg>
        </div>`,
        shooting: `<section class="shooting-star">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </section>`,
        star: `<div class="star">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 3000 3000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g><path style="opacity:0.998" fill="#f8d64d" d="M 2047.5,801.5 C 2047.5,801.833 2047.5,802.167 2047.5,802.5C 1837.48,955.178 1627.81,1108.34 1418.5,1262C 1497.2,1506.6 1576.2,1751.1 1655.5,1995.5C 1655.17,1995.83 1654.83,1996.17 1654.5,1996.5C 1446.86,1845.36 1239.36,1694.03 1032,1542.5C 824.64,1694.03 617.14,1845.36 409.5,1996.5C 487.213,1752.52 565.713,1508.52 645,1264.5C 645.667,1263.17 645.667,1261.83 645,1260.5C 435.5,1107.67 226,954.833 16.5,802C 275.834,801.833 535.167,801.333 794.5,800.5C 873.568,556.13 952.734,311.797 1032,67.5C 1111.25,311.753 1190.42,556.086 1269.5,800.5C 1528.83,801.5 1788.17,801.833 2047.5,801.5 Z"/></g></svg>
        </div>
        <div class="star">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 3000 3000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g><path style="opacity:0.998" fill="#f8d64d" d="M 2047.5,801.5 C 2047.5,801.833 2047.5,802.167 2047.5,802.5C 1837.48,955.178 1627.81,1108.34 1418.5,1262C 1497.2,1506.6 1576.2,1751.1 1655.5,1995.5C 1655.17,1995.83 1654.83,1996.17 1654.5,1996.5C 1446.86,1845.36 1239.36,1694.03 1032,1542.5C 824.64,1694.03 617.14,1845.36 409.5,1996.5C 487.213,1752.52 565.713,1508.52 645,1264.5C 645.667,1263.17 645.667,1261.83 645,1260.5C 435.5,1107.67 226,954.833 16.5,802C 275.834,801.833 535.167,801.333 794.5,800.5C 873.568,556.13 952.734,311.797 1032,67.5C 1111.25,311.753 1190.42,556.086 1269.5,800.5C 1528.83,801.5 1788.17,801.833 2047.5,801.5 Z"/></g></svg>
        </div>
        <div class="star">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 3000 3000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g><path style="opacity:0.998" fill="#f8d64d" d="M 2047.5,801.5 C 2047.5,801.833 2047.5,802.167 2047.5,802.5C 1837.48,955.178 1627.81,1108.34 1418.5,1262C 1497.2,1506.6 1576.2,1751.1 1655.5,1995.5C 1655.17,1995.83 1654.83,1996.17 1654.5,1996.5C 1446.86,1845.36 1239.36,1694.03 1032,1542.5C 824.64,1694.03 617.14,1845.36 409.5,1996.5C 487.213,1752.52 565.713,1508.52 645,1264.5C 645.667,1263.17 645.667,1261.83 645,1260.5C 435.5,1107.67 226,954.833 16.5,802C 275.834,801.833 535.167,801.333 794.5,800.5C 873.568,556.13 952.734,311.797 1032,67.5C 1111.25,311.753 1190.42,556.086 1269.5,800.5C 1528.83,801.5 1788.17,801.833 2047.5,801.5 Z"/></g></svg>
        </div>
        <div class="star">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 3000 3000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g><path style="opacity:0.998" fill="#f8d64d" d="M 2047.5,801.5 C 2047.5,801.833 2047.5,802.167 2047.5,802.5C 1837.48,955.178 1627.81,1108.34 1418.5,1262C 1497.2,1506.6 1576.2,1751.1 1655.5,1995.5C 1655.17,1995.83 1654.83,1996.17 1654.5,1996.5C 1446.86,1845.36 1239.36,1694.03 1032,1542.5C 824.64,1694.03 617.14,1845.36 409.5,1996.5C 487.213,1752.52 565.713,1508.52 645,1264.5C 645.667,1263.17 645.667,1261.83 645,1260.5C 435.5,1107.67 226,954.833 16.5,802C 275.834,801.833 535.167,801.333 794.5,800.5C 873.568,556.13 952.734,311.797 1032,67.5C 1111.25,311.753 1190.42,556.086 1269.5,800.5C 1528.83,801.5 1788.17,801.833 2047.5,801.5 Z"/></g></svg>
        </div>`
    }
    this.css = {
        flowing: `#detail {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 99;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 100vh;
        }
        .flowing {
            overflow: hidden;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .flowing span {
            position: relative;
            width: 0;
            height: 16.67vh;
            padding-left: 16.67vh;
            background: #4fc3dc;
            border-radius: 50%;
            box-shadow: 0 0 0 10px #4fc3cd44, 0 0 50px #4fc3dc, 0 0 100px #4fc3dc; 
            animation: flowing 15s linear infinite;
            animation-duration: calc(125s / var(--i));
            opacity: .7;
        }
        .flowing span:nth-child(even) {
            background: #ff2d75;
            box-shadow: 0 0 0 10px #ff2d7544, 0 0 50px #ff2d75, 0 0 100px #ff2d75;
        }
        @keyframes flowing {
            0% {
                transform: translateX(-10vw) scale(0);
            }
            100% {
                transform: translateX(100vw) scale(1);
            }
        }`,
        heart: `#detail {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 99;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 100vh;
        }
        .heart g {
            fill: #ff018c;
        }
        .heart:nth-child(1) {
            animation: one 5s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        .heart:nth-child(2) {
            animation: two 6s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        .heart:nth-child(3) {
            animation: three 7s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        .heart:nth-child(4) {
            animation: four 8s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        @keyframes one {
            0% {
                transform: translate(-100px, 0px) rotate(90deg);
            }
            50% {
                transform: translate(40vw, 100px) rotate(90deg);
                opacity: .8;
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
                opacity: .5;
            }
        }
        @keyframes two {
            0% {
                transform: translate(-6vw, 0px) rotate(90deg);
            }
            50% {
                transform: translate(45vw, 100px) rotate(90deg);
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
            }
        }
        @keyframes three {
            0% {
                transform: translate(-10vw, 0px) rotate(90deg);
            }
            50% {
                transform: translate(48vw, -200px) rotate(90deg);
                opacity: .8;
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
                opacity: .5;
            }
        }
        @keyframes four {
            0% {
                transform: translate(-8vw, 0px) rotate(90deg);
            }
            50% {
                transform: translate(42vw, 300px) rotate(90deg);
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
            }
        }`,
        shooting: `#detail {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 99;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 100vh;
        }
        .shooting-star {
            width: 100vw;
            height: 100vh;
        }
        .shooting-star span {
            position: absolute;
            height: 3%;
            width: 0;
            padding-left: 1.6875%;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(255, 255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255, 1);
            animation: animate 3s linear infinite;
            
        }
        .shooting-star span::before {
            content: '';
            position: absolute;
            top: 50%;
            height: 2px;
            width: 322px;
            background: linear-gradient(90deg, #fff, transparent);
        }
        @keyframes animate {
            0% {
                transform: rotate(45deg) translateX(0);
                opacity: 0;
            }
            30% {
                opacity: 1;
            }
            70% {
                opacity: 1;
            }
            100% {
                transform: rotate(45deg) translateX(-100vw);
                opacity: 0;
            }
        }
        .shooting-star span:nth-child(1) {
            right: 0;
            bottom: 0;
            animation-delay: 0s;
            animation-duration: 1s;
        }
        .shooting-star span:nth-child(2) {
            right: 0;
            bottom: 0;
            animation-delay: -.2s;
            animation-duration: 3s;
        }
        .shooting-star span:nth-child(3) {
            right: 80px;
            bottom: 0;
            animation-delay: .4s;
            animation-duration: 2s;
        }
        .shooting-star span:nth-child(4) {
            right: 0;
            bottom: 180px;
            animation-delay: .6s;
            animation-duration: 1.5s;
        }
        .shooting-star span:nth-child(5) {
            right: 400px;
            bottom: 180px;
            animation-delay: .6s;
            animation-duration: 1.5s;
        }
        .shooting-star span:nth-child(6) {
            right: 700px;
            bottom: 120px;
            animation-delay: .2s;
            animation-duration: 4s;
        }
        .shooting-star span:nth-child(7) {
            right: 0;
            bottom: 180px;
            animation-delay: .6s;
            animation-duration: 1.5s;
        }`,
        star: `#detail {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 99;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 100vh;
        }
        .star:nth-child(1) {
            animation: one 5s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        .star:nth-child(2) {
            animation: two 6s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        .star:nth-child(3) {
            animation: three 7s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        .star:nth-child(4) {
            animation: four 8s cubic-bezier(0.47, 0.17, 0.53, 0.81) infinite forwards;
        }
        @keyframes one {
            0% {
                transform: translate(-100px, 0px) rotate(90deg);
            }
            50% {
                transform: translate(40vw, 100px) rotate(90deg);
                opacity: .8;
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
                opacity: .5;
            }
        }
        @keyframes two {
            0% {
                transform: translate(-6vw, 0px) rotate(90deg);
            }
            50% {
                transform: translate(45vw, 100px) rotate(90deg);
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
            }
        }
        @keyframes three {
            0% {
                transform: translate(-10vw, 0px) rotate(90deg);
            }
            50% {
                transform: translate(48vw, -200px) rotate(90deg);
                opacity: .8;
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
                opacity: .5;
            }
        }
        @keyframes four {
            0% {
                transform: translate(-8vw, 0px) rotate(90deg);
            }
            50% {
                transform: translate(42vw, 300px) rotate(90deg);
            }
            100% {
                transform: translate(100vw, 0px) rotate(90deg);
            }
        }`
    }

    this.addDOM = function(DOM, detail, cb) {
        $(DOM).html(this.index[detail])
        $(DOM).ready(cb)
    }

    this.addCSS = function(detail) {
        const styleElement = document.createElement("style")
        styleElement.textContent = this.css[detail]
        document.head.appendChild(styleElement)
    }

    this.numofdetail = function() {
        return this.detailName.length
    }
}

function detail() {
    return new Detail()
}

function Theme() {
    this.index = {
        1: `<div class="textSlider__left"></div>
        <div class="slider"></div>
        <div class="textSlider__right"></div>`,
        2: `<div class="textSlider__left">
                <div class="wave-area">
                    <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                        <defs>
                            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
                        </defs>
                        <g class="parallax">
                            <use xlink:href="#gentle-wave" x="48" y="0" fill=""></use>
                            <use xlink:href="#gentle-wave" x="48" y="3" fill=""></use>
                            <use xlink:href="#gentle-wave" x="48" y="5" fill=""></use>
                            <use xlink:href="#gentle-wave" x="48" y="7" fill=""></use>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="slider"></div>
            <div class="textSlider__right"></div>`,
        3: `<div class="textSlider__left">
                <div class="wave-area">
                    <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                        <defs>
                            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
                        </defs>
                        <g class="parallax">
                            <use xlink:href="#gentle-wave" x="48" y="0" fill=""></use>
                            <use xlink:href="#gentle-wave" x="48" y="3" fill=""></use>
                            <use xlink:href="#gentle-wave" x="48" y="5" fill=""></use>
                            <use xlink:href="#gentle-wave" x="48" y="7" fill=""></use>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="slider"></div>
            <div class="textSlider__right"></div>`,
        4: `<div class="textSlider__left"></div>
            <div class="slider"></div>
            <div class="textSlider__right"></div>`
    }
    this.css = {
        1: `:root {
            --height: 0px;
            --width: 0px;
         }
         #tvScreen {
         background-color: #fff;
         display: flex;
         height: 100vh;
         overflow: hidden;
         }
         /* ========== TV TEXT =========== */
         .textSlider__left, .textSlider__right {
             flex: 1;
             overflow: hidden;
             padding: 20px;
             display: flex;
             justify-content: center;
             align-items: center;
             z-index: 9;
         }
         .textSlider__left img, .textSlider__right img {
             height: 100%;
             width: 100%;
         }
         .textSlider__left canvas {
             position: absolute;
             z-index: 10;
         }
        .slider {
            flex: 7;
            position: relative;
            z-index: 8;
        }
        .slide {
            /* object-fit: cover; */
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
         }
        .slide canvas {
            object-fit: cover;
            /* position: absolute; */
            width: 100%;
            height: 100%;
            /* transition: opacity 1s ease-in-out; */
         }
        .slider video {
            rotate: z 90deg;
            scale: 1.5;
            width: 100%;
            height: 100%;
        }
         .slide.current {
            opacity: 1;
         }`,
        2: `:root {
            --height: 0px;
            --width: 0px;
         }
        #tvScreen {
         background-color: #fff;
         display: flex;
         height: 100vh;
         overflow: hidden;
         }
         /* ========== TV TEXT =========== */
        .textSlider__left, .textSlider__right{
             flex: 1;
             overflow: hidden;
             padding: 20px;
             display: flex;
             justify-content: center;
             align-items: center;
             z-index: 9;
         }
        .textSlider__left img, .textSlider__right img {
             height: 100%;
             width: 100%;
         }
         
        .textSlider__left canvas {
            position: absolute;
            z-index: 10;
        }
        .slider {
            flex: 7;
            position: relative;
            z-index: 8;
        }
        .slide {
            /* object-fit: cover; */
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
         }
        .slide canvas {
            object-fit: cover;
            /* position: absolute; */
            width: 100%;
            height: 100%;
            /* transition: opacity 1s ease-in-out; */
         }
        .slider video {
            rotate: z 90deg;
            scale: 1.5;
            width: 100%;
            height: 100%;
        }
        .slide.current {
           opacity: 1;
        }
        .wave-area {
            position: absolute;
            width: 100vh;
            z-index: 9;
            transform: rotate(90deg) translateY(-140px);
        }
        .parallax > use {
            animation: move 8s linear infinite forwards;
        }
        .parallax > use:nth-child(2) {
            animation-delay: -7s;
            animation-duration: 7s;
            opacity: .5;
        }
        .parallax > use:nth-child(3) {
            animation-delay: -5s;
            animation-duration: 9s;
            opacity: .2;
        }
        .parallax > use:nth-child(4) {
            animation-delay: -2s;
            animation-duration: 4s;
            opacity: .7;
        }
        @keyframes move {
            0% {
                transform: translateX(-90px);
            }
            100% {
                transform: translateX(85px);
            }
        }`,
        3: `:root {
            --height: 0px;
            --width: 0px;
            }
            #tvScreen {
            background-color: #fff;
            display: flex;
            height: 100vh;
            overflow: hidden;
            }
            /* ========== TV TEXT =========== */
            .textSlider__left, .textSlider__right {
                flex: 1;
                overflow: hidden;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9;
            }
            .textSlider__left img, .textSlider__right img {
                height: 100%;
                width: 100%;
            }
            .textSlider__left canvas {
                position: absolute;
                z-index: 10;
            }
            .slider {
               flex: 7;
               position: relative;
               z-index: 8;
            }
            .slide {
               /* object-fit: cover; */
               position: absolute;
               width: 100%;
               height: 100%;
               opacity: 0;
               transition: opacity 1s ease-in-out;
            }
            .slide canvas {
               object-fit: cover;
               /* position: absolute; */
               width: 100%;
               height: 100%;
               /* transition: opacity 1s ease-in-out; */
            }
            .slider video {
               rotate: z 90deg;
               scale: 1.7;
               width: 100%;
               height: 100%;
            }
            .slide.current {
               opacity: 1;
            }
            .textSlider__left {
                position: absolute;
                height: 100vh;
                width: 200px;
                z-index: 9;
                opacity: .8;
                overflow: initial;
            }
            .wave-area {
                position: absolute;
                width: 100vh;
                z-index: 9;
                transform: rotate(90deg) translateY(-100px);
            }
            .parallax > use {
                animation: move 8s linear infinite forwards;
            }
            .parallax > use:nth-child(2) {
                animation-delay: -7s;
                animation-duration: 7s;
                opacity: .5;
            }
            .parallax > use:nth-child(3) {
                animation-delay: -5s;
                animation-duration: 9s;
                opacity: .2;
            }
            .parallax > use:nth-child(4) {
                animation-delay: -2s;
                animation-duration: 4s;
                opacity: .7;
            }
            @keyframes move {
                0% {
                    transform: translateX(-90px);
                }
                100% {
                    transform: translateX(85px);
                }
            }`,
            4: `:root {
                --height: 0px;
                --width: 0px;
                }
                #tvScreen {
                background-color: #fff;
                display: flex;
                height: 100vh;
                overflow: hidden;
                }
                /* ========== TV TEXT =========== */
                .textSlider__left, .textSlider__right {
                    display: none;
                }
                .slider {
                    flex: 7;
                    position: relative;
                    z-index: 8;
                }
                .slide {
                    /* object-fit: cover; */
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transition: opacity 1s ease-in-out;
                 }
                .slide canvas {
                    object-fit: cover;
                    /* position: absolute; */
                    width: 100%;
                    height: 100%;
                    /* transition: opacity 1s ease-in-out; */
                 }
                .slider video {
                    rotate: z 90deg;
                    scale: 2;
                    width: 100%;
                    height: 100%;
                }
                 .slide.current {
                    opacity: 1;
                 }`
    }

    this.addDOM = function(DOM, theme, cb) {
        $(DOM).html(this.index[theme])
        $(DOM).ready(cb)
    }

    this.addCSS = function(theme) {
        const styleElement = document.createElement("style")
        styleElement.textContent = this.css[theme]
        document.head.appendChild(styleElement)
    }

    this.numoftheme = function() {
        return Object.keys(this.index).length
    }
}

function theme() {
    return new Theme()
}

function BackgroundForUploadImg(container) {
    const thisObject = this
    this.container = container
    this.eleClass = "img-ele"
    this.src = [
        "/img/background/0.jpg",
        "/img/background/1.jpg",
        "/img/background/2.jpg",
        "/img/background/3.jpg",
        "/img/background/4.jpg",
        "/img/background/5.jpg",
        "/img/background/6.jpg",
    ]

    this.render = function() {
        for(let i = 0; i < this.src.length; i++) {
            $(this.container).append(`
                <div class="${this.eleClass}" data-id="${i}">
                    <img src=${this.src[i]} alt="">
                </div>
            `)
        }
        return this
    }

    this.css = `
        ${this.container} {
            overflow-x: auto;
            overflow-y: hidden;
            border: 2px solid #000;
            width: 90%;
            margin-top: 10px;
            border-radius: 20px;
            display: flex;
            flex-direction: row;
        }

        ${this.container} img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        ${this.container} .img-ele {
            aspect-ratio: 1;
            position: relative;
            height: 100%;
            padding: 5px;
        }

        ${this.container} .show:after {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            border-radius: 50%;
            border: 3px solid var(--main-color);
            width: 100%;
            height: 100%;
        }
    `

    this.addCSS = function() {
        const styleElement = document.createElement("style")
        styleElement.textContent = this.css
        document.head.appendChild(styleElement)
        return this
    }

    this.preview = function(preview) {
        $(`.${this.eleClass}`).click(function(e) {
            const id = e.currentTarget.getAttribute('data-id')
            $(`.${thisObject.eleClass}`).removeClass("show")
            $(preview).attr("src", "/img/background/" + id + ".jpg")
            $(e.currentTarget).addClass("show")
        })
        return this
    }
}

function backgroundForUploadImg(container) {
    return new BackgroundForUploadImg(container)
}
export { initialFetch, fetchImages, colorTable, detailCustom, modifyTemplateProcess, theme, detail, backgroundForUploadImg }