// Initialize Firebase
var config = {
    apiKey: "AIzaSyAynveG0RqBl3XvqPJ9YwmUF64372yqspU",
    authDomain: "sayfezone.firebaseapp.com",
    databaseURL: "https://sayfezone.firebaseio.com",
    projectId: "sayfezone",
    storageBucket: "sayfezone.appspot.com",
    messagingSenderId: "545310444914"
  };

firebase.initializeApp(config);

let allVideos = [];
let filteredVideos = [];
let lastTime = Math.round((new Date()).getTime() / 1000) - 1000;
let selectedVid = "";
let time = "";

  // Deletes all the videos in the row
  function deleteAllVideos(){
    $("#addVideos").children().empty();
  }

  function startStream(){
    parseAllVideos();

    //Selected the next closest video. Play it
    newVideo(text, selectedVid.sentiment, selectedVid.timestamp, selectedVid.video_link);
    setTimeout(queueNextVideo, 4000);
  }

  function queueNextVideo(){
    lastTime = lastTime + 4000; //
    parseAllVideos();
  }
    
  // Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
  // Also updates the graph to include the videos
  function parseAllVideos(){
    $.get({
      url: "https://searchandprotech.lib.id/sayfezonefilter@dev/",
      success: function(item){
        allVideos = item;

        // Find the closest video to now
        for (var video of allVideos){
            //Check if this is the one we actually want to display
            var thisTime = video.timestamp;
            if ( thisTime >= lastTime && (thisTime < selectedVid.timestamp || selectedVid == "")){
                selectedVid = video;
                console.log("this:");
                console.log(video);
            }
        }

        lastTime = selectedVid.timestamp;

        var text = "";
        //Now grab some data and populate the screen
        for (var resultObj of video.result){
            text+= resultObj.text.content;
            text+=" "
        }

        console.log("Selected: " + selectedVid);
        console.log(selectedVid);
      }
    });
  }
  
  // Adds video to dom
  function newVideo(text, sentiment, timestamp, link) {
    let oldVideo = $("#sample-video");
    let newVideo = oldVideo.clone();
    newVideo.attr("id", "")
    $("#addVideos").prepend(newVideo);
    if(sentiment > 0){
      newVideo.find(".sentiment-pos").text(sentiment)
      newVideo.find(".sentiment-neg").hide()
    } else {
      newVideo.find(".sentiment-neg").text(sentiment)
      newVideo.find(".sentiment-pos").hide()
    }
    let d = new Date(timestamp);
    newVideo.find(".timestamp").text(d.toUTCString()*1000)
    newVideo.find(".speech2text").text(text)
    newVideo.find(".vid-link").attr("src", link)
  }
  