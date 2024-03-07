import { createCircularLinkedList, checkSubs, preventDefault, createQueue } from "./module.js";
import { theme, detail } from './preview.js'
// Initial load for the entire TV
let playList = createCircularLinkedList()
let queue = createQueue()
let themeObj = theme(), detailObj = detail()
$(".warning .refresh").click(() => {location.reload()})
$.ajax({
   url: "/data/of.php",
   method: "GET",
   dataType: "json",
   success: function(e) {
      let iData = e;
      if(e.theme !== null && e.time !== null)
      fetchTheme(iData).then(res => {
      }).then(()=>{
         $(".loading").css("opacity", "0")
         // if(iData.mode === 'false') {
         // }
         queue.add(false)
         playList.setCurrentNode(playList.headNode())
         playList.autoplay(queue.getCurrentIndex(), playList.getCurrentNode()) // index is 1
      }).catch(err => {
         $(".loading p").html("There are no images/videos uploaded")
      })
      
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
            // themeRefresh(Data)
            location.reload()
         } else if (iData.bgcolor != Data.bgcolor || iData.detail != Data.detail) {
            iData.bgcolor = Data.bgcolor
            iData.detail = Data.detail
            // colordetail([Data.bgcolor, Data.detail])
            location.reload()
         } else if (iData.img.length < Data.img.length) {
            iData.img = Data.img
            let newFile = Data.img[Data.img.length - 1].filename // Get the last element from Data, which is the newest uploaded data
            let ext = newFile.split(".")[1], newUpload = {}, type, duration
            if(ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'avi') {
               type = 'video'
               duration = Data.img[Data.img.length - 1].duration
            } else {
               type = 'image'
               duration = Data.time
            }
            newUpload.filename = newFile
            newUpload.type = type
            newUpload.duration = duration
            playList.add(newUpload)
            addSlideToSlider(playList.getElementAt(playList.length() - 1)).then(() => {
               $(".loading").css("opacity", "0")
               queue.modify(queue.getCurrentIndex(),  true)
               queue.add(false)
               if(playList.length() > 1) {
                  $(".slider .--" + playList.getCurrentNode().data.filename.split(".")[0]).removeClass("current")
               }
               playList.setCurrentNode(playList.getElementAt(playList.length() - 1))
               playList.autoplay(queue.getCurrentIndex(), playList.getCurrentNode()) // Index is 2
            })
         } else if (iData.img.length > Data.img.length) {
            let iDataArr = iData.img.map(function(e) {
               return e.filename
            })
            let DataArr = Data.img.map(function(e) {
               return e.filename
            })
            let newFile = $(iDataArr).not(DataArr).get()
            playList.removeName(newFile[0])
            let removedDOMEle = $(".slider .--" + newFile[0].split(".")[0])
            removedDOMEle.remove()
            iData.img = Data.img
            if(playList.length() === 0) {
               queue.modify(queue.getCurrentIndex(), true)
               $(".loading").css("opacity", "1")
               $(".loading p").html("There are no images/videos uploaded")
            } else {
               // Handle if the removed DOM element has current class
               if(removedDOMEle.hasClass("current")) {
                  queue.modify(queue.getCurrentIndex(), true)
                  queue.add(false)
                  playList.setCurrentNode(playList.getCurrentNode().next)
                  playList.autoplay(queue.getCurrentIndex(), playList.getCurrentNode())
               }
            }
         }
      };
   
   }
})
function fetchTheme(array) {
   return new Promise((res, rej) => {
      themeObj.addDOM("#tvScreen", array.theme, null)
      themeObj.addCSS(array.theme)
      //JS FOR HTML AND CSS
      // Loop through fetched files and add those to linked list
      let imgArr = array.img
      for(let i = 0; i < imgArr.length; i++) {
         let filename = imgArr[i].filename, ext = filename.split(".")[1], type, duration
         if(ext === "MOV" || ext === "MP4" || ext === 'mov' || ext === 'mp4') {
            type = "video"
            duration = imgArr[i].duration
         } else {
            type = "image"
            duration = array.time
         }
         playList.add({
            filename: filename,
            type: type,
            duration: duration
         })
      }
      if (playList.length() === 0) {
         rej()
      } else {
         async function loopOverList() {
            // let current = playList.headNode()
            for(let i = 0; i < playList.length(); i++) {
               try {
                  await addSlideToSlider(playList.getElementAt(i))
               } catch(err) {
                  console.log(err)
               }
            }
         }
         loopOverList().then(() => {
            console.log("DOM loaded successfully")
         })
         // Fetch detail handling
         if(array.detail != "none") {
            detailObj.addDOM("#detail", array.detail, null)
            detailObj.addCSS(array.detail)
         } else {
            $("#detail").empty();
         }
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
         $(".textSlider__left").css("background-color", array.bgcolor);
         $(".textSlider__right").css("background-color", array.bgcolor);
         $(".parallax use").css("fill", array.bgcolor);
         res()
      }
   })
}

// CREATE OPERATION
function addSlideToSlider(node) {
   return new Promise((res, rej) => {
      const filename = node.data.filename.split(".")[0]
      if(node.data.type === 'video') {
         $(".slider").append('<div class="slide --'+filename+'"><video muted playsinline src="/admin/upload/'+node.data.filename+'"></video></div>')
         $(".slider .--"+filename+" video").on("loadeddata", () => {
            res()
         })
      } 
      else {
         $(".slider").append('<div class="slide --'+filename+'"><canvas></canvas></div>')
         const canvas = document.querySelector('.slider .--'+filename+' canvas')
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
            res()
         })             
      }
   })
}

playList.autoplay = function(index, currentNode) {
   // Current index
   const currentIndex = index
   // Check if kill is set to TRUE, if so kill the function
   if(queue.get(index)) {
      queue.remove(index)
      return
   }
   // Set current Node
   let current = currentNode
   playList.setCurrentNode(current)
   let $current = $(".slider .--" + current.data.filename.split(".")[0])
   $current.addClass("current")
   let video
   if(current.data.type === 'video') {
      video = $current.find("video").get(0)
      video.play()
   } 
   function imgWork() {
      return new Promise((res, rej) => {
         setTimeout(()=>{
            current = playList.getStop() ? current : current.next
            $current.removeClass("current")
            res(current)
         }, (current.data.duration)*1000)
      })
   }
   imgWork().then((current) => {
      playList.autoplay(currentIndex, current)
   })
}

// Check connection status
let $networkStatus = $('#networkStatus')
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

// Check subscription
checkSubs()
// Prevent default
preventDefault()