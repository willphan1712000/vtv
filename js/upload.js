const uploadingArea = document.getElementById("uploadingArea")
const fileInputTv = document.querySelector("#tvinpFile")
const bar = document.querySelector("#uploadingArea progress")
const progressLabel = document.querySelector("#uploadingArea label")
const signatureInput = document.querySelector("#preview .preview__btnArea input")
const previewImg = document.querySelector("#preview .preview__imgArea--img")
const previewSignature = document.querySelector("#preview .preview__signatureArea--img")
const previewFrame = document.querySelector('#preview .preview__imgArea')
import {$$, imageProcess} from './module.js'

// SHOW FORM
document.querySelector(".submit_box form").onclick = function() {
    document.querySelector("#tvinpFile").click();
}
$("#preview .preview__btn--add").click(function() {
    $(this).next().click()
})
$("#preview .preview__btn--cancel").click(function() {
    location.reload()
})

const imgProcess = imageProcess()

fileInputTv.onchange = (e) => {
    let file = e.target.files[0];
    const name = file.name
    const ext = name.split(".")[1]
    if (ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'avi') {
        uploadingArea.classList.add("active");
        uploadFileTv(file, 'mp4', 'video')
    } else {
        imgProcess.fileHandling(e, function(src) {
            const dataArr = {
                hasSignature: false
            }
            $("#preview").css("display", "flex")
            $("body").css("overflow", "hidden")
            previewImg.src = src
            dataArr.previewImg = $$(".preview__imgArea--img", undefined).draggable().distort()
            dataArr.previewSignature = $$("#preview .preview__signatureArea", ".preview__signatureArea--delete").draggable().distort().collide(function() {
                // if touched
                $(".preview__signatureArea--delete").addClass("glow")
                $("#preview .preview__signatureArea").hide('fast')
            }, function() {
                // if not touched
                $(".preview__signatureArea--delete").removeClass("glow")
                $("#preview .preview__signatureArea").show('fast')
            }, function() {
                // If endtouch and toucheds
                $(".preview__signatureArea--delete").removeClass("glow")
            })
            signatureInput.onchange = (e) => {
                const file = e.target.files[0]
                if(file) {
                    dataArr.hasSignature = true
                    imgProcess.fileHandling(e, function(src) {
                        previewSignature.src = src
                        $("#preview .preview__signatureArea").show()
                    })
                }
            }
            $("#preview .preview__btn--upload").click(function() {
                // Get outer image dimensions
                let [imgX, imgY, imgScale, imgAngle] = dataArr.previewImg.exportData()

                // create canvas 4x3
                var [canvas, ctx] = imgProcess.createCanvas(700, (16/9)*700)

                // draw outer image on canvas 4x3
                var [ctxReturned, srcEncoded] = imgProcess.drawImage(previewImg, ctx, imgX, imgY, imgScale, imgAngle, canvas, $(".preview__imgArea").width(), $(".preview__imgArea").height())
                // check if signature is added
                if(dataArr.hasSignature && !dataArr.previewSignature.isCollided()) {
                    // Get signature dimensions
                    let [sX, sY, sScale, sAngle] = dataArr.previewSignature.exportData()
                    var [,srcEncodedWithSignature] = imgProcess.drawImage(previewSignature, ctxReturned, sX, sY, sScale, sAngle, canvas, $(".preview__imgArea").width(), $(".preview__imgArea").height())

                    // Upload process starts here
                    uploadFileTv(srcEncodedWithSignature, 'jpg', 'image')
                    $("#preview").hide()
                    uploadingArea.classList.add("active")
                } else {
                    uploadFileTv(srcEncoded, 'jpg', 'image')
                    $("#preview").hide()
                    uploadingArea.classList.add("active")
                }
            })
        })
    }
}
function uploadFileTv(src, ext, type) {
    if(type === 'image') {
        let d = new Date()
        let fileName = d.getTime() + "." + ext
        let data = {
            body: src,
            name: fileName
        }
        let post = JSON.stringify(data);
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            location.reload();
        }
        xhr.open("POST", "/data/imgupload.php");
        xhr.upload.addEventListener("progress", ({loaded, total}) => {
            let fileLoaded = Math.floor((loaded/total)*100);
            bar.value = fileLoaded; 
            if (loaded == total) {
                bar.style.display = "none";
                progressLabel.innerHTML = `<p>Loading...</p></br>`;
            } else {
                progressLabel.innerHTML = `<p>Please wait</p></br>
                                    <p>${fileLoaded} %</p></br>`;
            }
        })
        xhr.setRequestHeader("Content-type",  "application/json");
        xhr.send(post);
    } else {
        const formData = new FormData();
        formData.append("tvinpFile", src)
        fetch("/data/videoupload.php", {
            method: "post",
            body: formData
        }).then(res => {
            location.reload()
        }).catch(err => console.log(err))
    }
}

function reachMultiImgMax() {
    if(currentImg === multiImgMax) {
        $(".submit_box .submit_box--tv").hide();
        $(".submit_box .reachMessage").css("display", "flex");
    }
}
reachMultiImgMax();