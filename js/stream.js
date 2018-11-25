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

let filteredVideos = [];
let lastTime = Math.round((new Date()).getTime() / 1000) - 1000;
let selectedVid = "";
let text = "";
let useAlt = true;
let newVideo;
let oldVideo;

  function startStream(){
    parseAllVideos();

    //Selected the next closest video. Play it
    if (selectedVid.sentimentData){
      
    }
    startVideo(text, 5, selectedVid.timestamp, selectedVid.video_link);

    setTimeout(queueNextVideo, 3000);
  }

  function queueNextVideo(){
    lastTime = lastTime + 3000; //
    parseAllVideos();
    setTimeout(setNextVideo, 2000);
  }

  function setNextVideo(){
    //Swap with the video elements here
    useAlt = !useAlt;
    //Prep the next one
    setTimeout(queueNextVideo, 3000);
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

        if (selectedVid != undefined && selectedVid.sentimentData != undefined && selectedVid.sentimentData.sentences){
          //Now grab some data and populate the screen
          for (var resultObj of selectedVid.sentimentData.sentences){
            text+= resultObj.text.content;
            text+=" "
          }
        }

        console.log("Selected: " + selectedVid);
        console.log(selectedVid);
      }
    });
  }

  function enableNextVideo (text, sentiment, timestamp , link){
    if (useAlt){
      oldVideo = newVideo.clone();
      updateVideoEle(oldVideo, text, sentiment, timestamp , link);
      newVideo.attr("id", "sample-video");
    }
    else {
      newVideo = oldVideo.clone();
      updateVideoEle(newVideo, text, sentiment, timestamp , link);
      oldVideo.attr("id", "sample-video");
    }
  }

  function updateVideoEle(video, text, sentiment, timestamp , link){
    video.attr("id", "");
    // video.autoplay = true;
    // video.load();

    if(sentiment > 0){
      video.find(".sentiment-pos").text(sentiment);
      video.find(".sentiment-neg").hide();
    } else {
      video.find(".sentiment-neg").text(sentiment);
      video.find(".sentiment-pos").hide();
    }
    let d = new Date(timestamp);
    video.find(".timestamp").text(d.toUTCString());
    video.find(".speech2text").text(text);
    video.find(".vid-link").attr("src", link);
  }
  
  // Adds video to dom
  function startVideo(text, sentiment, timestamp, link) {
    oldVideo = $("#sample-video");
    newVideo = oldVideo.clone();
    console.log("send help" + newVideo);
    updateVideoEle(newVideo);
  }
  