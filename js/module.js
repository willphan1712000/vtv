function Transform(ele1, ele2, ele3) {
    this.ele1 = ele1 // Main element
    this.ele2 = ele2 // Collision element
    this.ele3 = ele3 // Controller element
    this.collided = false
    this.x = 0
    this.y = 0
    this.scale = 1
    this.angle = 0
    const $ele1 = $(this.ele1)
    const $ele2 = $(this.ele2)
    const $ele3 = $(this.ele3)
    const $resize = $ele3.find(".resize")
    const $rotate = $ele3.find(".rotate")
    const thisObject = this
    
    this.setValue = function(x, y, scale, angle) {
        this.x = (x !== undefined) ? x : this.x
        this.y = (y !== undefined) ? y : this.y
        this.scale = (scale !== undefined) ? scale : this.scale
        this.angle = (angle !== undefined) ? angle : this.angle
    }
    this.performTransform = function(x, y, scale, angle) {
        $ele1.css({
            transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${angle}deg)`
        })
        $ele3.css({
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

    this.draggableTouch = function() {
        let iPosX, iPosY, posX, posY, dX, dY
        $ele3.on("touchstart", function(e) {
            e.preventDefault()
            e.stopPropagation()
            iPosX = e.touches[0].clientX
            iPosY = e.touches[0].clientY
            let [posX, posY, scale, angle] = thisObject.exportData()
            $ele3.on("touchmove", function(e) {
                dX = e.touches[0].clientX - iPosX
                dY = e.touches[0].clientY - iPosY
                iPosX = e.touches[0].clientX
                iPosY = e.touches[0].clientY
                posX += dX
                posY += dY
                thisObject.performTransform(posX, posY, scale, angle)
            })
            $ele3.on("touchend", function() {
                $ele3.off("touchmove", null)
                $ele3.off("touchend", null)
                thisObject.setValue(posX, posY, undefined, undefined)
            })
        })
        return this
    }

    this.draggableDesk = function() {
        $ele3.on("mousedown", function(e) {
            let iPosX, iPosY, dX, dY
            e.preventDefault()
            e.stopPropagation()
            iPosX = e.clientX
            iPosY = e.clientY
            let [posX, posY, scale, angle] = thisObject.exportData()
            $(window).on("mousemove", function(e) {
                dX = e.clientX - iPosX
                dY = e.clientY - iPosY
                iPosX = e.clientX
                iPosY = e.clientY
                posX += dX
                posY += dY
                thisObject.performTransform(posX, posY, scale, angle)
            })
            $(window).on("mouseup", function() {
                $(window).off("mousemove", null)
                $(window).off("mouseup", null)
                thisObject.setValue(posX, posY, undefined, undefined)
            })
        })
        return this
    }

    this.resizableTouch = function() {
        $resize.each(function(index, element) {
            $(element).on("touchstart", function(e) {
                e.preventDefault()
                e.stopPropagation()
                $(element).addClass("show")
                $(element).find(".circle").addClass("show")
                let iVectorX, iVectorY, vectorX, vectorY, ratio, width1, dX, dY
                ratio = $ele1.width()/$ele1.height()
                iVectorX = e.touches[0].clientX
                iVectorY = e.touches[0].clientY
                let [posX, posY, scale, angle] = thisObject.exportData()
                $(window).on("touchmove", function(e) {
                    vectorX = e.touches[0].clientX
                    vectorY = e.touches[0].clientY
                    dX = vectorX - iVectorX
                    dY = vectorY - iVectorY
                    width1 = $ele1.width()
                    
                    if($(element).hasClass("resize-bottomright")) {
                        $ele1.css({
                            width: width1 + dX,
                            height: width1/ratio + dY
                        })
                        $ele3.css({
                            width: width1 + dX,
                            height: width1/ratio + dY
                        })
                    } else if ($(element).hasClass("resize-bottomleft")) {
                        posX += dX
                        $ele1.css({
                            width: width1 - dX,
                            height: width1/ratio + dY
                        })
                        $ele3.css({
                            width: width1 - dX,
                            height: width1/ratio + dY
                        })
                    } else if ($(element).hasClass("resize-topright")) {
                        posY += dY
                        $ele1.css({
                            width: width1 + dX,
                            height: width1/ratio - dY
                        })
                        $ele3.css({
                            width: width1 + dX,
                            height: width1/ratio - dY
                        })
                    } else {
                        
                        posX += dX
                        posY += dY
                        $ele1.css({
                            width: width1 - dX,
                            height: width1/ratio - dY
                        })
                        $ele3.css({
                            width: width1 - dX,
                            height: width1/ratio - dY
                        })
                    }
                    thisObject.performTransform(posX, posY, scale, angle)
                    iVectorX = vectorX
                    iVectorY = vectorY
                })
    
                $(window).on("touchend", function() {
                    $(window).off("touchmove", null)
                    $(window).off("touchend", null)
                    thisObject.setValue(posX, posY, scale, angle)
                    $(element).removeClass("show")
                    $(element).find(".circle").removeClass("show")
                })
            })
        })
        return this
    }

    this.rotateTouch = function() {
        $rotate.on("touchstart", function(e) {
            e.preventDefault()
            e.stopPropagation()
            let vectorX, vectorY, X, Y
            X = $ele3.offset().left + $ele3.width()/2
            Y = $ele3.offset().top + $ele3.height()/2
            let [posX, posY, scale, angle] = thisObject.exportData()
            $(window).on("touchmove", function(e) {
                vectorX = X - e.touches[0].clientX - window.scrollX
                vectorY = Y - e.touches[0].clientY - window.scrollY

                angle = Math.atan2(vectorY, vectorX) * 180 / Math.PI + 90

                thisObject.performTransform(posX, posY, scale, angle)
            })

            $(window).on("touchend", function() {
                $(window).off("touchmove", null)
                $(window).off("touchend", null)
                thisObject.setValue(undefined, undefined, undefined, angle)
            })
        })
        return this
    }

    this.resizableDesk = function() {
        $resize.each(function(index, element) {
            $(element).on("mousedown", function(e) {
                e.preventDefault()
                e.stopPropagation()
                $(element).addClass("show")
                $(element).find(".circle").addClass("show")
                let iVectorX, iVectorY, vectorX, vectorY, ratio, width1, dX, dY
                ratio = $ele1.width()/$ele1.height()
                iVectorX = e.clientX
                iVectorY = e.clientY
                let [posX, posY, scale, angle] = thisObject.exportData()
                $(window).on("mousemove", function(e) {
                    vectorX = e.clientX
                    vectorY = e.clientY
                    dX = vectorX - iVectorX
                    dY = vectorY - iVectorY
                    width1 = $ele1.width()
                    
                    if($(element).hasClass("resize-bottomright")) {
                        $ele1.css({
                            width: width1 + dX,
                            height: width1/ratio + dY
                        })
                        $ele3.css({
                            width: width1 + dX,
                            height: width1/ratio + dY
                        })
                    } else if ($(element).hasClass("resize-bottomleft")) {
                        posX += dX
                        $ele1.css({
                            width: width1 - dX,
                            height: width1/ratio + dY
                        })
                        $ele3.css({
                            width: width1 - dX,
                            height: width1/ratio + dY
                        })
                    } else if ($(element).hasClass("resize-topright")) {
                        posY += dY
                        $ele1.css({
                            width: width1 + dX,
                            height: width1/ratio - dY
                        })
                        $ele3.css({
                            width: width1 + dX,
                            height: width1/ratio - dY
                        })
                    } else {
                        
                        posX += dX
                        posY += dY
                        $ele1.css({
                            width: width1 - dX,
                            height: width1/ratio - dY
                        })
                        $ele3.css({
                            width: width1 - dX,
                            height: width1/ratio - dY
                        })
                    }
                    thisObject.performTransform(posX, posY, scale, angle)
                    iVectorX = vectorX
                    iVectorY = vectorY
                })
    
                $(window).on("mouseup", function() {
                    $(window).off("mousemove", null)
                    $(window).off("mouseup", null)
                    thisObject.setValue(posX, posY, scale, angle)
                    $(element).removeClass("show")
                    $(element).find(".circle").removeClass("show")
                })
            })
        })
        return this
    }

    this.rotateDesk = function() {
        $rotate.on("mousedown", function(e) {
            e.preventDefault()
            e.stopPropagation()
            let iVectorX, iVectorY, vectorX, vectorY, initialAngle, currentAngle, dScale, X, Y
            X = $ele1.offset().left + $ele1.width()/2
            Y = $ele1.offset().top + $ele1.height()/2
            iVectorX = e.clientX - X
            iVectorY = e.clientY - Y
            let [posX, posY, scale, angle] = thisObject.exportData()
            initialAngle = Math.atan2(iVectorX, iVectorY)
            $(window).on("mousemove", function(e) {
                vectorX = e.clientX - X
                vectorY = e.clientY - Y
                currentAngle = Math.atan2(vectorX, vectorY)
                angle -= (currentAngle - initialAngle)*180/Math.PI
                // dScale = Math.sqrt(vectorX*vectorX + vectorY*vectorY)/Math.sqrt(iVectorX*iVectorX + iVectorY*iVectorY)
                // scale *= dScale
                thisObject.performTransform(posX, posY, scale, angle)
                iVectorX = vectorX
                iVectorY = vectorY
                initialAngle = currentAngle
            })

            $(window).on("mouseup", function() {
                $(window).off("mousemove", null)
                $(window).off("mouseup", null)
                thisObject.setValue(undefined, undefined, undefined, angle)
            })
        })
        return this
    }

    this.collide = function(touchedCb, notTouchedCb, touchEndCb) {
        let ele2X = $ele2.offset().left + $ele2.width()/2
        let ele2Y = $ele2.offset().top - $(window).scrollTop() + $ele2.height()/2
        let radius = $ele2.width()/2
        $ele3.on("touchstart", function(e) {
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

export { $$, update, checkSubs, colorConcept, preventDefault, imageProcess, owneraccount, time, createCircularLinkedList, createQueue }