let lastTime = Math.round((new Date()).getTime() / 1000) - 1000;
let selectedVid = "";
let newVideo;
let oldVideo = $("#stream");
let useAlt = true; //True = use old

  function startStream(){
    //Set up the references to the doms
    // newVideo = oldVideo.clone();
    // $("#addVideos").prepend(newVideo);

    parseAllVideos(setupVideo);
  }

  function setupVideo(){
    updateDom();
    useAlt = !useAlt;
    // setTimeout(startStream, 10000);
  }

  function updateDom(){
    let oldVideo = $("#sample-video");
    let newVideo = oldVideo.clone();
    newVideo.attr("id", "");
    // $("#addVideos").pop();
    $("#addVideos").empty();
    $("#addVideos").prepend(newVideo);
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

    var text = "";
    if(selectedVid != undefined && selectedVid.sentimentData != undefined && selectedVid.sentimentData.sentences){
      for (var resultObj of selectedVid.sentimentData.sentences){
        text+= resultObj.text.content;
        text+=" "
      }
    }


    //Update whatever dom
    if(sentiment > 0){
      newVideo.find(".sentiment-pos").text(sentiment);
      newVideo.find(".sentiment-neg").hide();
    } else {
      newVideo.find(".sentiment-neg").text(sentiment);
      newVideo.find(".sentiment-pos").hide();
    }
    newVideo.find(".timestamp").text(selectedVid.timestamp);
    newVideo.find(".vid-link").attr("src", selectedVid.video_link);
    newVideo.find(".speech2text").text(text)
    // target.find(".video").play();
    // let vid = newVideo.find(".video");
    // vid[0].onend = function(){
    //   clearInterval(startStream);
    // }
    $('video').on('ended',function(){
      startStream();
    });
  }
    
  // Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
  // Also updates the graph to include the videos
  function parseAllVideos(callback){
    $.get({
      url: "https://searchandprotech.lib.id/sayfezonefilter@dev/",
      success: function(item){
        allVideos = item;
     
        // selectedVid = "";
        // Find the closest video to now]
        for (var video of allVideos){
            //Check if this is the one we actually want to display
            var thisTime = video.timestamp;
            if ( thisTime > lastTime){
                selectedVid = video;
                // console.log(video);
                break;
            }
            // console.log(video.timestamp);
        }
        lastTime = selectedVid.timestamp; 

        callback();
      }
    });
  }