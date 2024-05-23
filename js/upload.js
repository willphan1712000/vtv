const uploadingArea = document.getElementById("uploadingArea")
const fileInputTv = document.querySelector("#tvinpFile")
const bar = document.querySelector("#uploadingArea progress")
const progressLabel = document.querySelector("#uploadingArea label")
const signatureInput = document.querySelector("#preview .preview__btnArea input")
const previewImg = document.querySelector("#preview .preview__imgArea--img")
const previewSignature = document.querySelector("#preview .preview__signatureArea--img")
const background = document.querySelector(".background-preview")
const previewFrame = document.querySelector('#preview .preview__imgArea')
import {$$,imageProcess} from './module.js'

// SHOW FORM
document.querySelector(".submit_box form").onclick = function() {
    document.querySelector("#tvinpFile").click();
}
$("#preview .preview__btn--add").click(function() {
    $(this).next().click()
})
$("#preview .preview__btn--cancel").click(function() {
    location.reload()
}
)

const imgProcess = imageProcess()

fileInputTv.onchange = (e) => {
    let file = e.target.files[0];
    if(file) {
        const name = file.name
        const ext = name.split(".")[1]
        if (ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'avi') {
            var URL = window.URL || window.webkitURL
            var video = document.createElement("video")
            var fileURL = URL.createObjectURL(file)
            video.src = fileURL
            video.addEventListener("loadeddata", function() {
                let duration = video.duration
                if(duration > maxVideoDuration) {
                    alert("Your video should be less than " + maxVideoDuration + " seconds")
                } else {
                    uploadingArea.classList.add("active");
                    uploadFileTv(file, 'mp4', 'video', duration)
                }
            })
        } else {
            imgProcess.fileHandling(e, function(src) {
                const obj = {}
                $("#preview").css("display", "flex")
                $("body").css("overflow", "hidden")
                previewImg.src = src
                $(".preview__imgArea--controller").css({
                    width: `calc(${previewImg.width}px + 0px)`,
                    height: `calc(${previewImg.height}px + 0px)`,
                    left: `calc(${previewFrame.getBoundingClientRect().left}px + 3px)`,
                    top: `calc(${previewFrame.getBoundingClientRect().top}px + 3px)`
                })
                obj.previewImg = $$(".preview__imgArea--img", ".preview__imgArea--controller .delete", ".preview__imgArea--controller").draggableTouch().draggableDesk().resizableTouch().rotateTouch().resizableDesk().rotateDesk().delete(function() {
                    $(".preview__imgArea--wrapper").hide()
                    $(".preview__imgArea--controller").hide()
                })
                obj.previewImg.setDeleted(false)
                obj.previewSignature = $$(".preview__signatureArea--img", ".preview__signatureArea--controller .delete", ".preview__signatureArea--controller").draggableTouch().draggableDesk().resizableTouch().resizableDesk().rotateTouch().rotateDesk().delete(function() {
                    $(".preview__signatureArea--controller").hide()
                    $("#preview .preview__signatureArea--wrapper").hide()
                })
                signatureInput.onchange = (e) => {
                    const file = e.target.files[0]
                    if(file) {
                        imgProcess.fileHandling(e, function(src) {
                            previewSignature.src = src
                            $(".preview__signatureArea--wrapper").show()
                            $(".preview__signatureArea--controller").show()
                            $(".preview__signatureArea--controller").css({
                                width: previewSignature.width,
                                height: previewSignature.height,
                                left: `calc(${previewFrame.getBoundingClientRect().left}px + 3px)`,
                                top: `calc(${previewFrame.getBoundingClientRect().top}px + 3px)`
                            })
                            obj.previewSignature.setDeleted(false)
                        })
                    }
                }
                $("#preview .preview__btn--upload").click(function() {
                    // Get outer image dimensions
                    const [imgX, imgY, imgScale, imgAngle] = obj.previewImg.exportData()

                    // Get signature dimensions
                    const [sX, sY, sScale, sAngle] = obj.previewSignature.exportData()

                    // create canvas
                    const ratio = 16/9
                    const width = 1200
                    var [canvas, ctx] = imgProcess.createCanvas(width, ratio*width)
                    
                    // Get color or gradient color
                    const typeOfBackground = background.getAttribute("data-type")
                    const valueOfBackground = background.getAttribute("data-color")
                    let [ctxReturned, srcEncoded] = imgProcess.drawColor(typeOfBackground, valueOfBackground, ctx, width, ratio)

                    // Draw image if it is not deleted
                    if(!obj.previewImg.isDeleted()) {
                        // draw outer image on canvas
                        [ctxReturned, srcEncoded] = imgProcess.drawImage(previewImg, ctxReturned, imgX, imgY, imgScale, imgAngle, canvas, $(".preview__imgArea").width(), $(".preview__imgArea").height())
                    }

                    // Draw signature if it is not deleted
                    if(!obj.previewSignature.isDeleted()) {
                        [ctxReturned ,srcEncoded] = imgProcess.drawImage(previewSignature, ctxReturned, sX, sY, sScale, sAngle, canvas, $(".preview__imgArea").width(), $(".preview__imgArea").height())
                    }

                    uploadFileTv(srcEncoded, 'jpg', 'image', undefined)
                    $("#preview").hide()
                    uploadingArea.classList.add("active")
                })
            })
        }
    }
}
function uploadFileTv(src, ext, type, duration) {
    let d = new Date()
    let uploadDataConfig = {
        filename: d.getTime() + "." + ext,
        body: src,
        duration: duration,
        ImgContentType: 'application/json',
        VideoContentType: false,
        ImgUrl: '/data/imgupload.php',
        VideoUrl: '/data/videoupload.php'
    }
    let data, contentType, url
    if(type === 'image') {
        url = uploadDataConfig.ImgUrl
        data = JSON.stringify({
            body: uploadDataConfig.body,
            name: uploadDataConfig.filename
        })
        contentType = uploadDataConfig.ImgContentType
    } else {
        url = uploadDataConfig.VideoUrl
        const formData = new FormData();
        formData.append("tvinpFile", uploadDataConfig.body)
        formData.append("duration", Math.floor(uploadDataConfig.duration)+1)
        formData.append("filename", uploadDataConfig.filename)
        data = formData
        contentType = uploadDataConfig.VideoContentType
    }
    $.ajax({
        url: url,
        method: "POST",
        data: data,
        contentType: contentType,
        processData: false,
        xhr: function() {
            var xhr = $.ajaxSettings.xhr()
            xhr.upload.onprogress = function(e) {
                if(e.lengthComputable) {
                    let fileLoaded = Math.floor((e.loaded/e.total)*100);
                    bar.value = fileLoaded; 
                    if (e.loaded == e.total) {
                        bar.style.display = "none";
                        progressLabel.innerHTML = `<p>Loading...<p></br>`;
                    } else {
                        progressLabel.innerHTML = `<p>Please wait</p></br><p>${fileLoaded} %</p></br>`;
                    }
                }

            }
            return xhr
        },
        success: function() {
            location.reload()
        }
    })
}

function reachMultiImgMax() {
    if(currentImg === multiImgMax) {
        $(".submit_box .submit_box--tv").hide();
        $(".submit_box .reachMessage").css("display", "flex");
    }
}
reachMultiImgMax();