let lastTime = Math.round((new Date()).getTime() / 1000) - 1000;
let selectedVid = "";
let newVideo;
let oldVideo;
let useAlt = true; //True = use old

  function startStream(){
    //Set up the references to the doms
    oldVideo = $("#stream");
    // newVideo = oldVideo.clone();
    // $("#addVideos").prepend(newVideo);

    parseAllVideos(setupVideo);
  }

  function setupVideo(){
    updateDom();
    useAlt = !useAlt;
    setTimeout(startStream, 10000);
  }

  function updateDom(){
    // newVideo.attr("id", "sample-video");
    // oldVideo.attr("id" ,"sample-video");
    var target = oldVideo;
    // if (useAlt){
    //   target = oldVideo;
    // }
    // target.attr("id","");

    console.log("booop");
    console.log(selectedVid);
    var sentiment = 0;
    if (selectedVid.sentimentData){
      sentiment = selectedVid.sentimentData.documentSentiment.score;
    }


    //Update whatever dom
    if(sentiment > 0){
      target.find(".sentiment-pos").text(sentiment);
      target.find(".sentiment-neg").hide();
    } else {
      target.find(".sentiment-neg").text(sentiment);
      target.find(".sentiment-pos").hide();
    }
    target.find(".timestamp").text(selectedVid.timestamp);
    target.find(".vid-link").attr("src", selectedVid.video_link);
    // target.find(".video").play();
    let vid = target.find(".video");
    vid[0].onplay = function(){
      clearInterval(refreshTimer);
    }
  }
    
  // Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
  // Also updates the graph to include the videos
  function parseAllVideos(callback){
    $.get({
      url: "https://searchandprotech.lib.id/sayfezonefilter@dev/",
      success: function(item){
        allVideos = item;

        console.log(lastTime);
     
        // selectedVid = "";
        // Find the closest video to now]
        for (var video of allVideos){
            //Check if this is the one we actually want to display
            var thisTime = video.timestamp;
            if ( thisTime > lastTime){
                selectedVid = video;
                console.log(video);
                break;
            }
            console.log(video.timestamp);
        }
        lastTime = selectedVid.timestamp; 

        callback();
      }
    });
  }