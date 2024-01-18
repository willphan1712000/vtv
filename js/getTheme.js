$(document).ready(function() {
   // Initial load for the entire TV
   let playList = new circularLinkedList()
   $.ajax({
      url: "/data/of.php",
      method: "GET",
      dataType: "json",
      success: function(e) {
         iData = e;
         fetchTheme(iData).then(res => {
            $(".loading").css("opacity", "0")
            initialSlide()
            if(iData.mode === 'false') {
               playList.autoplay()
            }
         }).catch(err => $(".loading p").html("There are no images/videos uploaded"))
         
         const evtSource = new EventSource('/data/fof.php');
         evtSource.onopen = function() {
         console.log("Connection to server opened.");
         };
         evtSource.onerror = function() {
         console.log("EventSource failed.");
         };
         
         evtSource.onmessage = function(event) {
            var Data = JSON.parse(event.data);
            if(iData.time != Data.time) {
               iData.time = Data.time;
               location.reload()
            }
            else if (iData.mode != Data.mode) {
               iData.mode = Data.mode;
               if(Data.mode === 'false') {
                  autoNextSlide(Data.time)
               }
            }
            else if (Data.left === 'true') {
               prevSlide()
               $.post("/data/manualslidingmode.php", {
                  manual: "leftdone",
               })
            } else if (Data.right === 'true') {
               nextSlide()
               $.post("/data/manualslidingmode.php", {
                  manual: "rightdone",
               })
            } else if (iData.theme != Data.theme) {
               iData.theme = Data.theme
               themeRefresh(Data)
            } else if (iData.bgcolor != Data.bgcolor || iData.detail != Data.detail) {
               iData.bgcolor = Data.bgcolor
               iData.detail = Data.detail
               colordetail([Data.bgcolor, Data.detail])
            } else if (iData.img.length < Data.img.length) {
               let iDataArr = iData.img.map(function(e) {
                  return e.filename
               })
               let DataArr = Data.img.map(function(e) {
                  return e.filename
               })
               let newFile = $(DataArr).not(iDataArr).get(), newUpload = {}
               ext = newFile[0].split(".")[1]
               if(ext === 'MOV' || ext === 'mp4') {
                  for(let i = 0; i < Data.img.length; i++) {
                     if(Data.img[i].filename === newFile[0]) {
                        newUpload.filename = Data.img[i].filename
                        newUpload.name = Data.img[i].filename.split(".")[0]
                        newUpload.type = 'video'
                        newUpload.duration = Data.img[i].duration
                        break
                     }
                  }
               } else {
                  newUpload.filename = newFile[0]
                  newUpload.name = newFile[0].split(".")[0]
                  newUpload.type = 'image'
                  newUpload.duration = Data.time
               }
               fetchNew(newUpload)
               iData.img = Data.img
               $(".loading").css("opacity", "1")
               $(".loading p").html("Loading")
            } else if (iData.img.length > Data.img.length) {
               let iDataArr = iData.img.map(function(e) {
                  return e.filename
               })
               let DataArr = Data.img.map(function(e) {
                  return e.filename
               })
               let newFile = $(iDataArr).not(DataArr).get()
               remove(newFile[0])
               iData.img = Data.img
               $(".loading").css("opacity", "1")
               $(".loading p").html("There are no images/videos uploaded")
            }
         };
      
      }
   })
   function fetchTheme(array) {
      return new Promise((res, rej) => {
         $.get(`/theme/${array.theme}/index.txt`, index => {
            if(array.detail != "none") {
               $.get(`/detail/${array.detail}/index.txt`, index => {
                     $("#detail").html(index);
                     $("#detail").append(`<link rel="stylesheet" type="text/css" href="/detail/${array.detail}/style.css">`);
               })
            } else {
               $("#detail").empty();
            }
            // IMPORT HTML, CSS
            $("#tvScreen").html(`<link rel="stylesheet" type="text/css" href="/theme/${array.theme}/style.css">`);
            $("#tvScreen").append(index);
            //JS FOR HTML AND CSS
            $.getJSON("data/image.php", (e)=>{
               for(let i = 0; i < e.length; i++) {
                  let filename = e[i].filename, ext = filename.split(".")[1], type, duration
                  if(ext === "MOV" || ext === "MP4") {
                     type = "video"
                     duration = e[i].duration
                  } else {
                     type = "image"
                     duration = array.time
                  }
                  playList.add({
                     filename: filename,
                     index: i,
                     type: type,
                     duration: duration
                  })
               }
               if (playList.length() === 0) {
                  rej();
               } else {
                  const count = []
                  const numberOfFiles = playList.length()
                  for(let i = 0; i < playList.length(); i++) {
                     addSlideToSlider(i, count)
                  }
                  setInterval(()=>{
                        if(count.length === numberOfFiles || numberOfFiles === 0) {
                           res();
                        }
                  }, 500)
                  // Left and Right Logo
                  if(array.theme === '1' || array.theme === '2' || array.theme === '3') {
                     $(document).ready(function(){
                        const left = document.querySelector(".textSlider__left");
                        left.appendChild(document.createElement("canvas"));
                        const canvas = document.querySelector(".textSlider__left canvas");
                        const ctx = canvas.getContext("2d");
                        $.get("/data/getlogoleft.php", e =>{
                            const img = new Image();
                            img.src = "/img/" + e;
                            img.addEventListener("load",()=>{
                                const ratio = img.width / img.height;
                                var height = 200;
                                var width = height*ratio;
                                canvas.width = height;
                                canvas.height = width;
                                ctx.rotate(90*Math.PI/180);
                                ctx.drawImage(img, 0, -height, width, height);
                            })
                        })
                    })
                    $(document).ready(function(){
                        const right = document.querySelector(".textSlider__right");
                        right.appendChild(document.createElement("canvas"));
                        const canvas = document.querySelector(".textSlider__right canvas");
                        const ctx = canvas.getContext("2d");
                        $.get("/data/getlogoright.php", e =>{
                            const img = new Image();
                            img.src = "/img/" + e;
                            img.addEventListener("load",()=>{
                                const ratio = img.width / img.height;
                                var height = 200;
                                var width = height*ratio;
                                canvas.width = height;
                                canvas.height = width;
                                ctx.rotate(90*Math.PI/180);
                                ctx.drawImage(img, 0, -height, width, height);
                            })
                        })
                    })
                  }
                  $(".textSlider__left").css("background-color",array.bgcolor);
                  $(".textSlider__right").css("background-color",array.bgcolor);
                  $(".parallax use").css("fill", array.bgcolor);
               }
            })
         })
      })
   }

   function addSlideToSlider(index, count) {
      return new Promise((res, rej) => {
         let node = playList.getElementAt(index)
         if(node.data.type === 'video') {
            $(".slider").append('<div class="slide --'+node.data.index+'"><video muted playsinline src="/admin/upload/'+node.data.filename+'"></video></div>')
            $(".slider .--"+node.data.index+" video").on("loadeddata", () => {
               count.push("")
            })
         } 
         else {
            $(".slider").append('<div class="slide --'+node.data.index+'"><canvas></canvas></div>')
            canvas();
            function canvas() {
               const canvas = document.querySelector('.slider .--'+node.data.index+' canvas')
               const ctx = canvas.getContext("2d");
               var image = new Image();
               image.src = "/admin/upload/"+node.data.filename;
               image.addEventListener("load",()=>{
                  var width = image.width;
                  var height = image.height;
                  canvas.width = height;
                  canvas.height = width;
                  ctx.rotate(90*Math.PI/180);
                  ctx.drawImage(image, 0, -height, width, height);
                  count.push("")
               })
            }
         }
         setInterval(() => {
            if(count.length === 1) {
               res()
            }
         }, 500)
      })
   }

   function removeSlideFromSlider(item) {
      return new Promise((res, rej) => {
         const name = item.split(".")[0]
         $removedItem = $(".slider .--" + name)
         $removedItem.remove()
         if($removedItem.hasClass("current")) {
            res()
         } else {
            rej()
         }
      })
   }

   playList.autoplay = function() {
      let current = this.getElementAt(this.length() - 1)
      function loop(current) {
         $current = $(".slider .current")
         if(current.data.type === 'video') {
            let video = $current.children().get(0)
            video.currentTime = 0
            video.play()
         }
         playList.setTimeOutVariable = setTimeout(()=>{
            $current.removeClass("current")
            if($current.next().is(".slide")) {
               $current.next().addClass("current")
            } else {
               $(".slider .slide").first().addClass("current")
            }
            current = current.next
            loop(current)
         }, (current.data.duration)*1000)
      }
      loop(current)
   }

   function fetchNew(newUpload) {
      playList.add(newUpload)
      clearTimeout(playList.setTimeOutVariable)
      addSlideToSlider(playList.length() - 1, count = []).then(() => {
         initialSlide()
      }).then(() => {
         playList.autoplay()
      })
   }


   // function nextSlide() {
   //    let $current = $(".current")
   //    $current.removeClass("current")
   //    $next = $current.next()
   //    if($next.is(".slide")) {
   //       $next.addClass("current")
   //       if($next.hasClass("video")) {
   //          let videoEle = $next.children().get(0)
   //          videoEle.currentTime = 0
   //          videoEle.play()
   //          $next.children().attr("loop", true)   
   //       }
   //    } else {
   //       $first = $(".slider .slide").first()
   //       $first.addClass("current")
   //       if($first.hasClass("video")) {
   //          let videoEle = $first.children().get(0)
   //          videoEle.currentTime = 0
   //          $first.children().attr("loop", true) 
   //       }
   //    }
   // }

   // function prevSlide() {
   //    let $current = $(".current")
   //    $current.removeClass("current")
   //    $prev = $current.prev()
   //    if($prev.is(".slide")) {
   //       $prev.addClass("current")
   //       if($prev.hasClass("video")) {
   //          let videoEle = $prev.children().get(0)
   //          videoEle.currentTime = 0
   //          videoEle.play()
   //          $prev.children().attr("loop", true) 
   //       }
   //    } else {
   //       $last = $(".slider .slide").last()
   //       $last.addClass("current")
   //       if($last.hasClass("video")) {
   //          let videoEle = $last.children().get(0)
   //          videoEle.play()
   //          $last.children().attr("loop", true) 
   //       }
   //    }
   // }

   function initialSlide() {
      $(".slide").each(function(ele) {
         if($(this).hasClass("current")) {
            $(this).removeClass("current")
         }
      })
      $last = $(".slider .slide").last().addClass('current')
   }

   function remove(item) {
      clearTimeout(playList.setTimeOutVariable)
      removeSlideFromSlider(item).then(() => {
         initialSlide()
      }).then(() => {
         playList.autoplay()
      }).catch(() => {
         console.log("oke")
         return
      })
   }
   function themeRefresh(item) {
      $("#tvScreen").empty()
      $("#detail").empty()
      clearTimeout(playList.setTimeOutVariable)
      playList.removeAll()
      fetchTheme(item).then(res => {
         $(".loading").css("opacity", "0")
         initialSlide()
         if(item.mode === 'false') {
            playList.autoplay()
         }
      }).catch(err => $(".loading p").html("There are no images/videos uploaded"))
   }
   function colordetail(item) {
      $(".textSlider__left").css("background-color", item[0]);
      $(".textSlider__right").css("background-color", item[0]);
      $(".parallax use").css("fill", item[0]);
      if(item[1] != "none") {
         $.get(`/detail/${item[1]}/index.txt`, index => {
            $("#detail").html(index);
            $("#detail").append(`<link rel="stylesheet" type="text/css" href="/detail/${item[1]}/style.css">`);
         })
      } else {
         $("#detail").empty();
      }
   }
   // Check connection status
   $networkStatus = $('#networkStatus')
   $(window).on("online", ()=>{
      $networkStatus.fadeIn('slow')
      $networkStatus.html('You are back online'); setTimeout(()=>{
         $networkStatus.fadeOut('slow')
      }, 3000)
   })
   $(window).on("offline", ()=>{
      $networkStatus.fadeIn('slow')
      $networkStatus.html('Try to connect to the internet');
   })

   // Reload everything when returning to the screen
   // document.addEventListener("visibilitychange", function() {
   //    location.reload()
   // })
})