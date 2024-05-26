function Transform(ele1, ele2, ele3) {
    this.ele1 = ele1 // Main element
    this.ele2 = ele2 // container
    this.collided = false
    this.deleted = true
    this.x = 0
    this.y = 0
    this.angle = 0
    this.w = 0
    this.h = 0
    const $ele2 = $(this.ele2)
    const imgFrame = document.querySelector(this.ele2)
    this.controllerClassName = this.ele1.substring(1) + '--controller'
    const thisObject = this

    const img = document.querySelector(this.ele1 + " > img")
    let ratio = img.width / img.height

    this.setRatio = function(r) {
        ratio = r
    }
    
    this.setValue = function(x, y, angle, w, h) {
        this.x = (x !== undefined) ? x : this.x
        this.y = (y !== undefined) ? y : this.y
        this.angle = (angle !== undefined) ? angle : this.angle
        this.w = (w !== undefined) ? w : this.w
        this.h = (h !== undefined) ? h : this.h
    }

    this.exportData = function() {
        return [this.x, this.y, this.angle, this.w, this.h]
    }

    this.isCollided = function() {
        return this.collided
    }

    this.setIsCollided = function(is) {
        this.collided = is
    }

    this.isDeleted = function() {
        return this.deleted
    }

    this.setDeleted = function(is) {
        this.deleted = is
    }

    this.css = `
        ${this.ele1} {
            position: absolute;
            transform-origin: top left;
            user-select: none;
        }
        ${this.ele1} > img {
            object-fit: contain;
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            z-index: 1;
            transform: translate(-50%, -50%)
        }
        .${this.controllerClassName}--container {
            position: absolute;
            transform-origin: top left;
            user-select: none;
        }
        .${this.controllerClassName} {
            position: absolute;
            user-select: none;
            border: solid 3px #6924d5;
            z-index: 1;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
        }
        .${this.controllerClassName} .resize {
            background-color: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            transition: all .1s linear;
        }
        .${this.controllerClassName} .resize.show {
            background-color: #6924d5;
        }
        .${this.controllerClassName} .resize > .circle {
            background-color: #f0f0f0a8;
            position: absolute;
            top: -15px;
            left: -15px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            z-index: -1;
            visibility: hidden;
            transition: all .1s linear;
        }
        .${this.controllerClassName} .resize > .circle.show {
            visibility: visible;
        }
        .${this.controllerClassName} .resize.resize-topleft {
            position: absolute;
            top: -10px;
            left: -10px;
        }
        .${this.controllerClassName} .resize.resize-topright {
            position: absolute;
            top: -10px;
            right: -10px;
        }
        .${this.controllerClassName} .resize.resize-bottomleft {
            position: absolute;
            bottom: -10px;
            left: -10px;
        }
        .${this.controllerClassName} .resize.resize-bottomright {
            position: absolute;
            bottom: -10px;
            right: -10px;
        }
        .${this.controllerClassName} .rotate {
            position: absolute;
            top: -50px;
            left: calc(50% - 15px);
            width: 30px;
            height: 30px;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .${this.controllerClassName} .delete {
            position: absolute;
            bottom: -50px;
            left: calc(50% - 15px);
            width: 30px;
            height: 30px;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `

    this.controllerTemplate = `
    <div class="${this.controllerClassName}--container">
    <div class="${this.controllerClassName}">
        <div class="dot resize resize-topleft"><div class="circle"></div></div>
        <div class="dot resize resize-topright"><div class="circle"></div></div>
        <div class="dot resize resize-bottomleft"><div class="circle"></div></div>
        <div class="dot resize resize-bottomright"><div class="circle"></div></div>
        <div class="dot rotate"><i class="fa-solid fa-rotate"></i></div>
        <div class="dot delete"><i class="fa-solid fa-trash"></i></div>
    </div>
    </div>
    `

    this.addController = function() {
        $ele2.after(this.controllerTemplate)
        return this
    }

    this.addCSSForController = function() {
        const styleElement = document.createElement('style')
        styleElement.textContent = this.css
        document.head.appendChild(styleElement)
        return this
    }

    this.delete = function(cb) {
        function handleDelete(e) {
            e.preventDefault()
            e.stopPropagation()
            cb()
            thisObject.setDeleted(true)
        }
        $(this.ele1 + "--controller .delete").on("touchstart", e => handleDelete(e))
        $(this.ele1 + "--controller .delete").on("mousedown", e => handleDelete(e))
        return this
    }

    this.repositionElement = function(x, y) {
        const controllerWrapper = document.querySelector(this.ele1 + '--controller--container');
        const boxWrapper = document.querySelector(this.ele1);

        boxWrapper.style.left = x + 'px';
        boxWrapper.style.top = y + 'px';
        controllerWrapper.style.left = (x + imgFrame.offsetLeft + 3) + 'px';
        controllerWrapper.style.top = (y + imgFrame.offsetTop + 3) + 'px';
    }

    this.resize = function(w, h) {
        const controller = document.querySelector(this.ele1 + '--controller');
        const img = document.querySelector(this.ele1 + " > img")

        controller.style.width = w + 6 + 'px';
        controller.style.height = h + 6 + 'px';
        img.style.width = w + 'px';
        // img.style.height = h + 'px';
    }

    this.rotateBox = function(deg) {
        const controllerWrapper = document.querySelector(this.ele1 + '--controller--container');
        const boxWrapper = document.querySelector(this.ele1);

        boxWrapper.style.transform = `rotate(${deg}deg)`;
        controllerWrapper.style.rotate = `${deg}deg`;
        controllerWrapper.querySelector(".delete").style.rotate = `${-deg}deg`
    }

    this.transform = function() {
        const controller = document.querySelector(this.ele1 + '--controller');
        const controllerWrapper = document.querySelector(this.ele1 + '--controller--container');
        const boxWrapper = document.querySelector(this.ele1);

        const minWidth = 40;
        const minHeight = 40;

        var initX, initY, mousePressX, mousePressY, initW, initH, initRotate;

        function getCurrentRotation(el) {
            var st = window.getComputedStyle(el, null);
            var tm = st.getPropertyValue("-webkit-transform") ||
                st.getPropertyValue("-moz-transform") ||
                st.getPropertyValue("-ms-transform") ||
                st.getPropertyValue("-o-transform") ||
                st.getPropertyValue("transform")
            "none";
            if (tm != "none") {
                var values = tm.split('(')[1].split(')')[0].split(',');
                var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
                return (angle < 0 ? angle + 360 : angle);
            }
            return 0;
        }

        function mousedownCb(event) {
            event.target.classList.add("show")
            event.target.querySelector(".circle").classList.add("show")
        }
        
        function mouseupCb(event) {
            event.target.classList.remove("show")
            event.target.querySelector(".circle").classList.remove("show")
        }

        // drag support
        function handleDrag(event, type) {
            event.preventDefault()
            event.stopPropagation()
            initX = boxWrapper.offsetLeft;
            initY = boxWrapper.offsetTop;
            mousePressX = (type === 'desk') ? event.clientX : event.touches[0].clientX;
            mousePressY = (type === 'desk') ? event.clientY : event.touches[0].clientY;
            let [,,, w, h] = thisObject.exportData()
    
            function eventMoveHandler(event) {
                let x = (type === 'desk') ? event.clientX : event.touches[0].clientX
                let y = (type === 'desk') ? event.clientY : event.touches[0].clientY
                var posX = initX + (x - mousePressX)
                var posY = initY + (y - mousePressY)
                thisObject.repositionElement(posX, posY);
                thisObject.setValue(posX - w / 2, posY - h / 2, undefined, undefined, undefined)
            }
    
            if(type === 'desk') {
                controllerWrapper.addEventListener('mousemove', eventMoveHandler, false);
                window.addEventListener('mouseup', function eventEndHandler() {
                    controllerWrapper.removeEventListener('mousemove', eventMoveHandler, false);
                    window.removeEventListener('mouseup', eventEndHandler);
                }, false);
            } else {
                controllerWrapper.addEventListener('touchmove', eventMoveHandler, false);
                window.addEventListener('touchend', function eventEndHandler() {
                    controllerWrapper.removeEventListener('touchmove', eventMoveHandler, false);
                    window.removeEventListener('touchend', eventEndHandler);
                }, false);
            }
        }
        controllerWrapper.addEventListener('mousedown', e => handleDrag(e, 'desk'), false);
        controllerWrapper.addEventListener('touchstart', e => handleDrag(e, 'touch'), false);
        // done drag support

        // handle resize
        // var rightMid = document.getElementById("right-mid");
        // var leftMid = document.getElementById("left-mid");
        // var topMid = document.getElementById("top-mid");
        // var bottomMid = document.getElementById("bottom-mid");

        var leftTop = document.querySelector(this.ele1 + "--controller .resize-topleft");
        var rightTop = document.querySelector(this.ele1 + "--controller .resize-topright");
        var rightBottom = document.querySelector(this.ele1 + "--controller .resize-bottomright");
        var leftBottom = document.querySelector(this.ele1 + "--controller .resize-bottomleft");

        function resizeHandler(event, left = false, top = false, xResize = false, yResize = false, type) {
            event.preventDefault()
            event.stopPropagation()
            initX = boxWrapper.offsetLeft;
            initY = boxWrapper.offsetTop;
            mousePressX = (type === 'desk') ? event.clientX : event.touches[0].clientX;
            mousePressY = (type === 'desk') ? event.clientY : event.touches[0].clientY;

            initW = img.offsetWidth;
            initH = img.offsetHeight;

            initRotate = getCurrentRotation(boxWrapper);
            
            var initRadians = initRotate * Math.PI / 180;
            var cosFraction = Math.cos(initRadians);
            var sinFraction = Math.sin(initRadians);
            mousedownCb(event)
            var vectorC = [mousePressX - initX - imgFrame.offsetLeft, mousePressY - initY - imgFrame.offsetTop]
            function eventMoveHandler(event) {
                var x = ((type === 'desk') ? event.clientX : event.touches[0].clientX)
                var y = ((type === 'desk') ? event.clientY : event.touches[0].clientY)
                var wDiff = x - mousePressX
                var hDiff = y - mousePressY
                var vectorD = [wDiff, hDiff]
                const c = (vectorC[0] * vectorD[0] + vectorC[1] * vectorD[1]) / (vectorC[0] * vectorC[0] + vectorC[1] * vectorC[1])
                var vectorH = [c * vectorC[0], c * vectorC[1]]
                // var rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
                // var rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;
                var rotatedWDiff = cosFraction * vectorH[0] + sinFraction * vectorH[1];
                var rotatedHDiff = cosFraction * vectorH[1] - sinFraction * vectorH[0];
                rotatedHDiff = (rotatedHDiff*rotatedWDiff > 0) ? (rotatedWDiff / ratio) : (- rotatedWDiff / ratio);

                var newW = initW, newH = initH, newX = initX, newY = initY;

                if (xResize) {
                    if (left) {
                        newW = initW - rotatedWDiff;
                        if (newW < minWidth) {
                        newW = minWidth;
                        rotatedWDiff = initW - minWidth;
                        }
                    } else {
                        newW = initW + rotatedWDiff;
                        if (newW < minWidth) {
                        newW = minWidth;
                        rotatedWDiff = minWidth - initW;
                        }
                    }
                    newX += 0.5 * rotatedWDiff * cosFraction;
                    newY += 0.5 * rotatedWDiff * sinFraction;
                }

                if (yResize) {
                    if (top) {
                        newH = initH - rotatedHDiff;
                        if (newH < minHeight) {
                        newH = minHeight;
                        rotatedHDiff = initH - minHeight;
                        }
                    } else {
                        newH = initH + rotatedHDiff;
                        if (newH < minHeight) {
                        newH = minHeight;
                        rotatedHDiff = minHeight - initH;
                        }
                    }
                    newX -= 0.5 * rotatedHDiff * sinFraction;
                    newY += 0.5 * rotatedHDiff * cosFraction;
                }

                thisObject.resize(newW, newH);
                thisObject.repositionElement(newX, newY);
                thisObject.setValue(newX - newW / 2, newY - newH / 2, undefined, newW, newH)
            }

            if(type === 'desk') {
                window.addEventListener('mousemove', eventMoveHandler, false);
                window.addEventListener('mouseup', function eventEndHandler() {
                    mouseupCb(event)
                    window.removeEventListener('mousemove', eventMoveHandler, false);
                    window.removeEventListener('mouseup', eventEndHandler);
                }, false);
            } else {
                window.addEventListener('touchmove', eventMoveHandler, false);
                window.addEventListener('touchend', function eventEndHandler() {
                    mouseupCb(event)
                    window.removeEventListener('touchmove', eventMoveHandler, false);
                    window.removeEventListener('touchend', eventEndHandler);
                }, false);
            }
        }


        // rightMid.addEventListener('mousedown', e => resizeHandler(e, false, false, true, false));
        // leftMid.addEventListener('mousedown', e => resizeHandler(e, true, false, true, false));
        // topMid.addEventListener('mousedown', e => resizeHandler(e, false, true, false, true));
        // bottomMid.addEventListener('mousedown', e => resizeHandler(e, false, false, false, true));
        leftTop.addEventListener('mousedown', e => resizeHandler(e, true, true, true, true, 'desk'));
        rightTop.addEventListener('mousedown', e => resizeHandler(e, false, true, true, true, 'desk'));
        rightBottom.addEventListener('mousedown', e => resizeHandler(e, false, false, true, true, 'desk'));
        leftBottom.addEventListener('mousedown', e => resizeHandler(e, true, false, true, true, 'desk'));

        leftTop.addEventListener('touchstart', e => resizeHandler(e, true, true, true, true, 'touch'));
        rightTop.addEventListener('touchstart', e => resizeHandler(e, false, true, true, true, 'touch'));
        rightBottom.addEventListener('touchstart', e => resizeHandler(e, false, false, true, true, 'touch'));
        leftBottom.addEventListener('touchstart', e => resizeHandler(e, true, false, true, true, 'touch'));

        // handle rotation
        var rotate = document.querySelector(thisObject.ele1 + "--controller .rotate");
        function handleRotate(event, type) {
            event.preventDefault()
            event.stopPropagation()
    
            initX = event.target.offsetLeft;
            initY = event.target.offsetTop;
            mousePressX = (type === 'desk') ? event.clientX : event.touches[0].clientX;
            mousePressY = (type === 'desk') ? event.clientY : event.touches[0].clientY;
    
    
            var arrow = document.querySelector(thisObject.ele1 + '--controller');
            var arrowRects = arrow.getBoundingClientRect();
            var arrowX = arrowRects.left + arrowRects.width / 2;
            var arrowY = arrowRects.top + arrowRects.height / 2;
    
            function eventMoveHandler(event) {
                let x = (type === 'desk') ? event.clientX : event.touches[0].clientX
                let y = (type === 'desk') ? event.clientY : event.touches[0].clientY
                var angle = Math.atan2(y - arrowY, x - arrowX) + Math.PI / 2;
                angle *= 180 / Math.PI
                thisObject.rotateBox(angle);
                thisObject.setValue(undefined, undefined, angle, undefined, undefined)
            }
            if(type === 'desk') {
                window.addEventListener('mousemove', eventMoveHandler, false);
    
                window.addEventListener('mouseup', function eventEndHandler() {
                    window.removeEventListener('mousemove', eventMoveHandler, false);
                    window.removeEventListener('mouseup', eventEndHandler);
                }, false);
            } else {
                window.addEventListener('touchmove', eventMoveHandler, false);
    
                window.addEventListener('touchend', function eventEndHandler() {
                    window.removeEventListener('touchmove', eventMoveHandler, false);
                    window.removeEventListener('touchend', eventEndHandler);
                }, false);
            }
        }
        rotate.addEventListener('mousedown', e => handleRotate(e, 'desk'), false);
        rotate.addEventListener('touchstart', e => handleRotate(e, 'touch'), false);

        thisObject.resize(200, 200 / ratio);
        thisObject.repositionElement(100, 100 / ratio);
        thisObject.setValue(0, 0, 0, 200, 200 / ratio)
        return this
    }
}

function $$(ele1, ele2, ele3, ele4) {
    if(arguments.length === 3) {
        return new Transform(ele1, ele2, ele3)
    }
}

function update() {
    const evtSource = new EventSource('/data/update.php')
    evtSource.onopen = function() {
       console.log('Connection to server opened.')
    }
    evtSource.onerror = function() {
       console.log('EventSource failed.')
    }
    evtSource.onmessage = function(event) {
        let signal = JSON.parse(event.data)
        if(signal != null) {
            if(signal.isupdate == 'true') {
                $.post("/admin/data/updateTech.php")
                if(confirm("Reload to see changes")) {
                    location.reload();
                }
            }
        }
    }
}

function checkSubs(isPage) {
    $.ajax({
        url: "/data/checkSubs.php",
        method: "GET",
        dataType: "json",
        success: function(e) {
            if(isPage) {
                pageToTerminate(e.subs)
            } else {
                terminateToPage(e.subs)
            }
        }
    })
    function pageToTerminate(when) {
        const d = new Date();
        const expiration = new Date(formattingDate(when))
        if(d.getTime() >= expiration.getTime()) {
            window.location = "/subsTerminated.php";
        }
    }
    function terminateToPage(when) {
        const d = new Date();
        const expiration = new Date(formattingDate(when))
        if(d.getTime() < expiration.getTime() || when === null) {
            window.location = "/";
        }
    }
    function formattingDate(date) {
        return date + " 00:00:00";
    }
}

function colorConcept() {
    $.get("/data/colorConcept.php", function(e) {
        document.querySelector(":root").style.setProperty("--main-color", `${e}`);
    })
}

function preventDefault() {
    window.onload = function () {
        document.addEventListener("contextmenu", e => {
            e.preventDefault();
        })
        document.onkeydown = function(e) {
            if (e.ctrlKey || e.metaKey ) {
                return false;
            }
        }
    }
}

function ToggleButton(edit, del, no) {
    this.edit = edit
    this.del = del
    this.no = no
    $edit = $(this.edit)
    $delete = $(this.del)
    $no = $(this.no)

    this.toggle = function() {
        $edit.click(event => {
            event.preventDefault();
            $(event.currentTarget).parent().next().slideToggle('fast');
        });
    
        $delete.click( function(event){
            event.preventDefault();
            $(event.currentTarget).parent().next().next().slideToggle('fast');
            var offsetTop = $(this).offset().top;
            $('html, body').animate({
                scrollTop: offsetTop
            })
        });
        
        $no.click(event=>{
            event.preventDefault();
            $(event.currentTarget).parent().parent().slideUp('fast');
        });
    }
}

function ImageProcess() {
    this.fileHandling = function(e, cb) {
        const {target} = e
        const file = target.files[0]
        if(file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function(readerEvent) {
                const imgElement = document.createElement("img")
                imgElement.src = readerEvent.target.result
                imgElement.onload = function(imgEvent) {
                    cb(imgEvent.target.src)
                }
            }
        }
    }

    this.createCanvas = function(width, height) {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = width
        canvas.height = height
        return [canvas, ctx]
    }
    
    this.drawImage = function(e, ctx, x, y, scale, angle, canvas, containerWidth, containerHeight) {
        const ratioX = canvas.width/containerWidth
        const ratioY = canvas.height/containerHeight
        let finalX = x*ratioX
        let finalY = y*ratioY
        let midleWidth = e.width*ratioX
        let midleHeight = e.height*ratioY
        let finalWidth = e.width*ratioX*scale
        let finalHeight = e.height*ratioY*scale

        ctx.save()
        ctx.translate(finalX + midleWidth/2, finalY + midleHeight/2)
        ctx.rotate((angle*Math.PI)/180)
        ctx.drawImage(e, -finalWidth/2, -finalHeight/2, finalWidth, finalHeight);
        ctx.restore()
        const srcEncoded = ctx.canvas.toDataURL(e).split(",")[1]
        return [ctx, srcEncoded]
    }

    this.drawColor = function(type, color, ctx, width, ratio) {
        if(type === "") color = "#ffffff"
        if(type === "gradient") {
            const breakdownArr = color.split(",")
            var [angle, color1, percent1, color2, percent2] = [breakdownArr[0], breakdownArr[1], breakdownArr[2], breakdownArr[3], breakdownArr[4]]
            const radians = (angle - 180) * Math.PI / 180
            const x0 = width / 2 + (width / 2) * Math.cos(radians - Math.PI / 2);
            const y0 = width*ratio / 2 + (width*ratio / 2) * Math.sin(radians - Math.PI / 2);
            const x1 = width / 2 - (width / 2) * Math.cos(radians - Math.PI / 2);
            const y1 = width*ratio / 2 - (width*ratio / 2) * Math.sin(radians - Math.PI / 2);
            const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
            gradient.addColorStop(percent1/100, color1)
            gradient.addColorStop(percent2/100, color2)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, width * ratio)
            const srcEncoded = ctx.canvas.toDataURL().split(",")[1]
            return [ctx, srcEncoded]
        } else {
            ctx.fillStyle = color
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            const srcEncoded = ctx.canvas.toDataURL().split(",")[1]
            return [ctx, srcEncoded]
        }
    }
}

function toggleButton(edit, del, no) {
    return new ToggleButton(edit, del, no)
}

function imageProcess() {
    return new ImageProcess()
}

function owneraccount(){
    var $display = $(".owner_box--block .display").children();
    $(".owner_box [name='setOwner']").click(event=>{
        event.preventDefault();
        var $username_box = $(".owner_box [name='owner']");
        var $password_box = $(".owner_box [name='password']");
        var $re_password_box = $(".owner_box [name='re_password']");
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
    let $pw = $(".owner_box--block .set [name='password'], .owner_box--block .set [name='re_password']");
    let $eye = $(".owner_box--block .set i");
    $eye.click(()=>{
        if ($pw.attr('type') == "password") {
            $pw.attr('type','text');
            $eye.removeClass("active");
        } else {
            $pw.attr('type','password');
            $eye.addClass("active");
        }
    })
}

function time() {
    $("button[name='timeBtn']").click(e => {
        e.preventDefault();
        let $fetchTimeBox = $(".time-interval p span")
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
}

function CircularLinkedList() {
    // Function to create Node
    let Node = function(data) {
        this.data = data;
        this.next = null;
    }

    // Below is private properties
    let length = 0;
    let head = null;
    let stop = false;
    let current;

    // Set stop property
    this.setStop = function(is) {
        stop = is
    }

    // Get stop property
    this.getStop = function() {
        return stop
    }

    // Set current Node
    this.setCurrentNode = function(Node) {
        current = Node
    }

    // Get current Node
    this.getCurrentNode = function() {
        return current
    }

    // Get element at specific index
    this.getElementAt = function(index) {
        if(index >= 0 && index <= length) {
            let node = head;
            for(let i = 0; i < index && node != null; i++) {
                node = node.next;
            }
            return node;
        }
        return undefined;
    }

    // Get element at specific filename
    this.getElementWith = function(filename) {
        if(filename) {
            let current = head
            for(let i = 0; i < this.length(); i++) {
                if(current.data.filename === filename) {
                    return current
                } else {
                    current = current.next
                }
            }
            return undefined
        }
        return undefined
    }

    // Add new Node to the list - add to the last
    this.add = function(data) {
        const node = new Node(data);
        let current;

        if(head === null) {
            head = node;
        } else {
            current = this.getElementAt(length - 1);
            current.next = node;
        }

        node.next = head; // This is how a circular linked list is formed because the last node points to the head
        length++;
    }

    // Insert new Node to the list
    this.insert = function(data, index) {
        if (index >= 0 && index <= length) {
            const node = new Node(data)
            let current = head

            if(index === 0) {
                if(head === null) {
                    head = node
                    node.next = head 
                } else {
                    node.next = head
                    current = this.getElementAt(length)
                    head = node
                    current.next = head
                }
            } else {
                const previous = this.getElementAt(index - 1)
                node.next = previous.next
                previous.next = node
            }

            length++
            return true
        }
        return false
    }

    // Remove element at any position
    this.removeAt = function(index) {
        if(index >= 0 && index <= length) {
            let current = head

            if(index === 0) {
                if(length === 1) {
                    head = null
                } else {
                    const removed = head
                    current = this.getElementAt(length - 1)
                    head = head.next
                    current.next = head
                    current = removed // You want to return what node was removed
                }
            } else {
                const previous = this.getElementAt(index - 1)
                current = previous.next
                previous.next = current.next
            }

            length--
            return current.data
        }
        return undefined
    }

    // Remove element having a specific data
    this.removeName = function(itemName) {
        let current = head, index = 0
        if(length === 1) {
            head = null
            length--
        } else {
            while(true) {
                let name = current.data.filename
                if(name === itemName) {
                    break
                } else {
                    current = current.next
                    index++
                    if(index === length - 1) {
                        break
                    }
                }
            }
            this.removeAt(index)
        }
    }

    // Get length of the linked list
    this.length = function() {
        return length
    }

    // Get the head node, this is the same as getting the node with index 0
    this.headNode = function() {
        return head
    }
    
    this.removeAll = function() {
        length = 0
        head = null
    }
}

function createCircularLinkedList() {
    return new CircularLinkedList()
}

function Queue() {
    this.current = 0
    this.store = {}
    // Add data to current index
    this.add = function(data) {
        this.current++
        this.store[this.current] = data
    }
    // Return data at specified index
    this.get = function(index) {
        return this.store[index]
    }
    // Modify data at specified index
    this.modify = function(index, data) {
        this.store[index] = data
    }
    // Remove data at specified index
    this.remove = function(index) {
        delete this.store[index]
    }
    // Get current index
    this.getCurrentIndex = function() {
        return this.current
    }
}

function createQueue() {
    return new Queue()
}

function switchScreen() {
    if (window.innerWidth > 510) {
        window.location = "/tv.php";
    }
}

function getSecond() {
    const obj = new Date()
    return obj.getTime()
}

export { $$, update, checkSubs, colorConcept, preventDefault, imageProcess, owneraccount, time, createCircularLinkedList, createQueue, switchScreen, getSecond }