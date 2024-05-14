function Body() {
    this.elementID = ['preview', 'uploadingArea', 'admin', 'copyright']
    this.cssArr = [
        `/* =========== Preview Box Style ============== */
        #preview {
           width: 100%;
           height: 100%;
           overflow: hidden;
           z-index: 99;
           position: absolute;
           position: fixed;
           top: 0;
           left: 0;
           background-color: #00000063;
           display: none;
           justify-content: center;
           align-items: center;
           flex-direction: column;
           backdrop-filter: blur(10px);
        }
        #preview .preview__imgArea {
           width: 80vw;
           height: 142vw;
           position: relative;
           border: dashed 3px #000;
           background-color: #fff;
           border-radius: 15px;
        }
        #preview .preview__imgArea--wrapper {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #preview .preview__signatureArea {
           position: absolute;
           top: 0;
           left: 0;
           display: none;
           width: 50%;
           z-index: 1;
        }
        #preview .preview__imgArea--img {
           width: 100%;
           object-fit: contain;
        }
        #preview .preview__signatureArea--img {
            width: 100%;
            object-fit: contain;
        }
        #preview .preview__imgArea--controller {
            position: absolute;
            top: 0;
            left: 0;
            border: solid 3px #6924d5;
        }
        #preview .preview__signatureArea--controller {
            position: absolute;
            top: 0;
            left: 0;
            border: solid 3px #6924d5;
        }
        #preview .resize {
            background-color: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
        .resize.resize-topleft {
            position: absolute;
            top: -10px;
            left: -10px;
        }
        .resize.resize-topright {
            position: absolute;
            top: -10px;
            right: -10px;
        }
        .resize.resize-bottomleft {
            position: absolute;
            bottom: -10px;
            left: -10px;
        }
        .resize.resize-bottomright {
            position: absolute;
            bottom: -10px;
            right: -10px;
        }
        #preview .rotate {
            position: absolute;
            bottom: -50px;
            left: 45%;
            width: 30px;
            height: 30px;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #preview .preview__btnArea {
           display: flex;
           flex-direction: row;
           justify-content: center;
           align-items: center;
           margin-bottom: 20px;
        }
        #preview .preview__btn {
           background-color: rgb(255, 255, 255);
           border-radius: 10px;
           padding: 15px;
           margin: 10px;
           cursor: pointer;
           text-wrap: nowrap;
        }
        #preview .preview__btn--cancel {
           background-color: rgba(255, 0, 0, 0.6);
           color: #fff;
        }
        #preview .preview__signatureArea--delete {
           background-color: rgba(255, 0, 0, 0.6);
           border-radius: 50%;
           width: 50px;
           height: 50px;
           font-size: 30px;
           display: flex;
           justify-content: center;
           align-items: center;
           color: #fff;
           margin-top: 10px;
           transition: all .3s;
           display: flex;
           margin: auto;
        }
        #preview .preview__signatureArea--delete.glow {
           box-shadow: 0 0 50px 15px #e04848;
        }
        
        /* Signature box */
        .signature_box .preview {
           width: calc(100% + 6vh);
           position: relative;
           left: -3vh;
        }
        .signature_box .preview .previewImg {
           width: 100%;
           height: 100%;
        }
        .signature_box .preview .signature {
           display: none;
           position: absolute;
           top: 0;
           left: 0;
           width: 25%;
        }
        .signature_box .preview .signature .layer {
           position: absolute;
           width: calc(100% + 14px);
           height: calc(100% + 14px);
           border: solid #000 2px;
           border-radius: 5px;
           top: -7px;
           left: -7px;
        }
        .signature_box .preview img {
           width: 100%;
           height: 100%;
        }
        .signature_box .signatureBtn {
           display: none;
           justify-content: center;
           align-items: center;
           width: 100%;
           height: 50px;
           position: relative;
           margin-top: 10px;
           cursor: pointer;
        }
        .signature_box .signatureBtn::before {
           content: "";
           position: absolute;
           top: 0;
           left: 0;
           background: linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b);
           width: 100%;
           height: 100%;
           border-radius: 10px;
        }
        .signature_box .signatureBtn .spanText {
           background-color: #f0f0f0;
           color: #000;
           position: relative;
           width: calc(100% - 6px);
           height: calc(100% - 6px);
           display: flex;
           justify-content: center;
           align-items: center;
           border-radius: 10px;
        }
        .signature_box .signatureBtn__add .confirm {
           display: none;
        }
        .signature_box .signatureBtn__edit .confirmPosition {
           display: none;
        }
        .signature_box .signatureBtn__edit .signatureBtn__edit--remove {
           background-color: #ff0000ba;
           color: #fff;
        }
        .signature_box .signatureBtn__edit .spanText {
           margin: 0px 5px 0px 5px;
        }
        .signature_box .signatureBtn span.background {
           color: #f0f0f0;
        }`
    ]
    this.contentArr = [
        `<!-- ========== Preview Image =============== -->
        <h3 style="color: #fff; margin-top: 70px;">Drag, Zoom, or Rotate</h3>
        <div class="preview__imgArea">
            <div class="preview__signatureArea">
                <img class="preview__signatureArea--img" alt="" draggable="false">
                <div class="preview__signatureArea--controller">
                    <div class="resize resize-topleft"></div>
                    <div class="resize resize-topright"></div>
                    <div class="resize resize-bottomleft"></div>
                    <div class="resize resize-bottomright"></div>
                    <div class="rotate"><i class="fa-solid fa-rotate"></i></div>
                </div>
            </div>
            <div class="preview__imgArea--wrapper">
                <img class="preview__imgArea--img" alt="" draggable="false">
                <div class="preview__imgArea--controller">
                    <div class="resize resize-topleft"></div>
                    <div class="resize resize-topright"></div>
                    <div class="resize resize-bottomleft"></div>
                    <div class="resize resize-bottomright"></div>
                    <div class="rotate"><i class="fa-solid fa-rotate"></i></div>
                </div>
            </div>
        </div>
        <div class="preview__signatureArea--delete"><i class="fa-solid fa-trash-can"></i></div>
        <div class="preview__btnArea">
            <div class="preview__btn preview__btn--add"><i class="fa-solid fa-signature"></i> Add Signature</div>
            <input type="file" name="" hidden accept="image/*">
            <div class="preview__btn preview__btn--upload"><i class="fa-solid fa-arrow-up"></i> Upload</div>
            <div class="preview__btn preview__btn--cancel"><i class="fa-solid fa-x"></i> Cancel</div>
        </div>`,
        `<div class = "uploadingBox">
            <label for="progressBar"></label>
            <progress id='progressBar' value = "0" max = "100"></progress>
        </div>`,
        [
            `<div class="dashboard">
                <h3>TV 1 ADMIN</h3>
                <div class="dash_btn__area">
                    <div class="dash_logo__area"></div>
                    <form action="" method="POST" enctype="multipart/form-data">
                            <button class="dash_btn" type="submit" name="logOut"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</button>
                    </form>
                </div>
            </div>`,
            `<div class="functions">
                <!-- ====== TV Preview ====== -->
                <div class="box customization">
                    <div></div>
                    <h3>TV Customization Preview</h3>
                    <div class="customization__row">
                        <a href="theme.php" class="button getTheme"><span class="effect"></span>Choose template</a>
                        <div class="preview theme__option">
                            <div class="loader"></div>
                            <div class="theme-data"></div>
                            <div id="detail"></div>
                        </div>
                        <div class="customization__row--block">
                            <div class="template__modify">
                                <div class="template__modify--btn"><span>Modify Template</span></div>
                                <div class="template__modify--color">
                                    <div class="back-to-original"><i class="fa-solid fa-arrow-left"></i></div>
                                    <div class="bg__colorTable--tv colorTable"></div>
                                    <div class="next-to-detail"><i class="fa-solid fa-arrow-right"></i></div>
                                </div>
                                <div class="template__modify--detail">
                                    <div class="back-to-color"><i class="fa-solid fa-arrow-left"></i></div>
                                    <div class="detail-list"></div>
                                    <div class="template__modify--confirm"><i class="fa-solid fa-check"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="box manual">
                    <h3>Manual Sliding Mode</h3>
                    <div class="manual-switch">
                        <label class="switch">
                            <input type="checkbox" hidden>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="manual-controller">
                        <div class="left"><i class="fa-solid fa-arrow-left"></i></div>
                        <div class="right"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                </div> -->
                <div class="box submit_box">
                    <div class="submit_box--tv">
                        <h3>Upload TV Image (9x16)</h3>
                        <p>${multiImgMax} Maximum</p>
                        <form action="" method="POST" enctype="multipart/form-data">
                            <input id="tvinpFile" type="file" accept="image/*" name="fileTv" hidden>
                            <p>Upload</p>
                        </form>
                    </div>
                    <div class="reachMessage"><i class="fa-solid fa-circle-exclamation"></i>You have reached ${multiImgMax} images</div>
                </div>
                <div class="box tv__uploaded_box">
                    <h3>Uploaded TV Image</h3>
                    <div class="image_block"></div>
                    <div class="count"></div>
                </div>
                <div class="footer">
                    <form action="" method="POST">
                        <button class="ft_btn" type="submit" name="logOut">LOG OUT</button>
                    </form>
                </div>
            </div>`
        ],
        `<p>${copyright}</p>`
    ]   

    this.createBody = function() {
        const arrID = this.elementID
        for(let i = 0; i < arrID.length; i++) {
            $("body").append(`<div id="${arrID[i]}"></div>`)
        }
    }

    this.createSubElement = function() {
        const arrID = this.elementID
        for(let i = 0; i < arrID.length; i++) {
            let v = this.contentArr[i]
            if(Array.isArray(v)) {
                for(let j = 0; j < v.length; j++) {
                    $(`#${arrID[i]}`).append(v[j])
                }
            } else {
                $(`#${arrID[i]}`).append(v)
            }
        }
    }

    this.addCSS = function() {
        const styleElement = document.createElement("style")
        const arrCss = this.cssArr
        for(let i = 0; i < arrCss.length; i++) {
            styleElement.textContent += arrCss[i] 
        }
        document.head.appendChild(styleElement)
    }
}

function body() {
    return new Body()
}

export {body}