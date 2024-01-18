function TransformTouch(ele1, ele2) {
    this.ele1 = ele1
    this.ele2 = ele2
    this.collided = false
    this.x = 0
    this.y = 0
    this.scale = 1
    this.angle = 0
    const $ele1 = $(this.ele1)
    const $ele2 = $(this.ele2)
    
    this.setValue = function(x, y, scale, angle) {
        this.x = (x !== undefined) ? x : this.x
        this.y = (y !== undefined) ? y : this.y
        this.scale = (scale !== undefined) ? scale : this.scale
        this.angle = (scale !== undefined) ? angle : this.angle
    }
    this.performTransform = function($ele, x, y, scale, angle) {
        $ele.css({
            transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${angle}deg)`
        })
    }

    this.exportData = function() {
        return [this.x, this.y, this.scale, this.angle]
    }

    this.isCollided = function() {
        return this.collided
    }

    this.setIsCollided = function(is) {
        this.collided = is
    }

    const thisObject = this
    this.draggable = function() {
        $ele1.on("touchstart", function(e) {
            e.preventDefault() // Prevent the page from scrolling
            e.stopPropagation() // Prevent the finger from touching another element that is overlapped by the targeted element
            if(e.targetTouches.length >= 1) {
                let iPosX = e.targetTouches[0].clientX
                let iPosY = e.targetTouches[0].clientY
                let [posX, posY, scale, angle] = thisObject.exportData()
                $(this).on("touchmove", function(e) {
                    let dX = e.targetTouches[0].clientX - iPosX
                    let dY = e.targetTouches[0].clientY - iPosY
                    iPosX = e.targetTouches[0].clientX
                    iPosY = e.targetTouches[0].clientY
                    posX += dX
                    posY += dY
                    thisObject.performTransform($(this), posX, posY, scale, angle)
                })
                $(this).on("touchend", function() {
                    $(this).off("touchmove", null)
                    $(this).off("touchend", null)
                    thisObject.setValue(posX, posY, undefined, undefined)
                })
            }
        })
        return this
    }

    this.distort = function() {
        $ele1.on("touchstart", function(e) {
            e.preventDefault()
            e.stopPropagation()
            if(e.targetTouches.length === 2) {
                let finger1X = e.targetTouches[0].clientX
                let finger1Y = e.targetTouches[0].clientY
                let finger2X = e.targetTouches[1].clientX
                let finger2Y = e.targetTouches[1].clientY
                let iVectorX = finger2X - finger1X
                let iVectorY = finger2Y - finger1Y
                let initialAngle = Math.atan2(iVectorX, iVectorY)
                let [posX, posY, scale, angle] = thisObject.exportData()
                $(this).on("touchmove", function(e) {
                    finger1X = e.targetTouches[0].clientX
                    finger1Y = e.targetTouches[0].clientY
                    finger2X = e.targetTouches[1].clientX
                    finger2Y = e.targetTouches[1].clientY
                    vectorX = finger2X - finger1X
                    vectorY = finger2Y - finger1Y
                    let currentAngle = Math.atan2(vectorX, vectorY)
                    angle -= (currentAngle - initialAngle)*180/Math.PI
                    let dScale = Math.sqrt(vectorX*vectorX + vectorY*vectorY)/Math.sqrt(iVectorX*iVectorX + iVectorY*iVectorY)
                    scale *= dScale
                    thisObject.performTransform($(this), posX, posY, scale, angle)
                    iVectorX = vectorX
                    iVectorY = vectorY
                    initialAngle = currentAngle
                })
                $(this).on("touchend", function() {
                    $(this).off("touchmove", null)
                    $(this).off("touchend", null)
                    thisObject.setValue(undefined, undefined, scale, angle)
                })
            }
        })
        return this
    }

    this.collide = function(touchedCb, notTouchedCb, touchEndCb) {
        let ele2X = $ele2.offset().left + $ele2.width()/2
        let ele2Y = $ele2.offset().top + $ele2.height()/2
        let radius = $ele2.width()/2
        $ele1.on("touchstart", function(e) {
            e.preventDefault()
            e.stopPropagation()
            $(this).on("touchmove", function(e) {
                let fingerX = e.targetTouches[0].clientX
                let fingerY = e.targetTouches[0].clientY
                let distanceX = fingerX - ele2X
                let distanceY = fingerY - ele2Y
                let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY)
                if(distance <= radius) {
                    thisObject.setIsCollided(true)
                    touchedCb()
                } else {
                    thisObject.setIsCollided(false)
                    notTouchedCb()
                }
            })
            $(this).on("touchend", function() {
                if(thisObject.isCollided()) {
                    thisObject.setValue(0, 0, 1, 0)
                    let [x, y, scale, angle] = thisObject.exportData()
                    thisObject.performTransform($(this), x, y, scale, angle)
                    touchEndCb()
                }
                $(this).off("touchmove", null)
                $(this).off("touchend", null)
            })
        })
        return this
    }
    this.terminate = function() {
        $ele1.off("touchstart", null)
        $(document).off("touchmove", null)
        $(document).off("touchend", null)
        return this
    }
}

function $$(ele1, ele2, ele3, ele4) {
    if(arguments.length === 2) {
        return new TransformTouch(ele1, ele2)
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

function checkSubs() {
    $.ajax({
        url: "/data/checkSubs.php",
        method: "GET",
        dataType: "html",
        success: function(e) {
            checkSubs(e);
        }
    })
    function checkSubs(when) {
        const d = new Date();
        const expiration = new Date(formattingDate(when));
        if(d.getTime() >= expiration.getTime()) {
            window.location = "/subsTerminated.php";
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
}

function toggleButton(edit, del, no) {
    return new ToggleButton(edit, del, no)
}

function imageProcess() {
    return new ImageProcess()
}

export { $$, update, checkSubs, colorConcept, preventDefault, imageProcess }