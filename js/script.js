let allVideos = [];
let filteredVideos = [];

let keepAllVids = false;
let sortFunction = null;

let decreasingTimeStamp =function(x, y){
    return y.timestamp - x.timestamp;
}

let increasingTimeStamp =function(x, y){
    return x.timestamp - y.timestamp;
}

let increasingSentiment =function(x, y){
    return y.sentimentData.documentSentiment.score - x.sentimentData.documentSentiment.score;
}

function sortNewest(){
  keepAllVids  = true;
  sortFunction = increasingTimeStamp;
  populateAllVideos();

}

function sortSentiment(){
  sortFunction = increasingSentiment;
  populateAllVideos();
}

sortFunction = increasingTimeStamp;

function sortOldest(){

}

var refreshTimer = window.setInterval(populateAllVideos, 15000 );

function resetRefreshTimer(){
  console.log("Adding another refresh timer");
  refreshTimer = window.setInterval(populateAllVideos, 15000 );
}

function clickGraph(data){
  clearInterval(refreshTimer);
  filteredVideos = [];

  for (var i = Math.max(data.index-2,0); i < Math.min(allVideos.length, data.index+3);i++){
    filteredVideos.push(allVideos[i]);
  }

  deleteAllVideos();
  addVideos(filteredVideos);
}

// Funcition to test newVideo. Do not call
function copyVideo() {
  newVideo("I really like cake... and pie", 12, "Nov 24, 2018 9:55AM");
}

// Deletes all the videos in the row
function deleteAllVideos(){
  $("#addVideos").children().empty();
}

function filterNegSentiments(videos){
  return videos.filter(vid => vid.minSent < -0.1);
}

// Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
// Also updates the graph to include the videos
function populateAllVideos(){
  $.get({
    url: "https://searchandprotech.lib.id/sayfezonefilter@dev/",
    success: function(item){
      let numPending = item.filter(vid=>vid.state ==="PENDING").length;
      item = item.filter(vid => "sentimentData" in vid);
      $(".pending_items").text(numPending);

      allVidsWithDates = item.map(function (x){
        x.date = new Date(x.timestamp);
        x.minSent = Math.min(x.sentimentData.documentSentiment.score,
          Math.min.apply(null, x.sentimentData.sentences.map(sentence => sentence.sentiment.score)));
        return x;
      });
      allVidsWithDates.sort(sortFunction);


      /*
      if(allVidsWithDates.length == allVideos.length){
        console.log("No page refresh needed");
        return;
      }
      */
      allVideos = allVidsWithDates;


      let filteredVids = allVideos;
      if (!keepAllVids){
        filteredVids = filterNegSentiments(allVideos);
      }

      // Actually get the videos

      deleteAllVideos();
      addVideos(filteredVids);

      // Show all the items  on the graph
      let data1 = []
      let x_labels = []
      videoMapping = {}
      for(let i = 0;i<allVideos.length;i++){
        let video = allVideos[i];
        data1.push( video.minSent );

        x_labels.push(video.date.toLocaleString("en-US"));
      }

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            data1
          ],
          onclick: clickGraph
        },
        axis: {
          x: {
            type: 'category',
            categories: x_labels,
            show: false
          },
          y: {
            show:false
          }
        },
        legend: {
          show: false
        }
      })
      }
  });
}

// Add all videos to dom
function addVideos(videos){
  for (var video of videos){
    let text = "";
    if(video != undefined && video.sentimentData != undefined && video.sentimentData.sentences){
      for (var resultObj of video.sentimentData.sentences){
        text+= resultObj.text.content;
        text+=" "
      }
    }
    newVideo(text, video.minSent, video.date, video.video_link);
  }
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
  newVideo.find(".timestamp").text(timestamp.toUTCString())
  newVideo.find(".speech2text").text(text)
  newVideo.find(".vid-link").attr("src", link)
  let vid = newVideo.find(".video");
  vid[0].onplay = function(){
    console.log("Clearning");
    clearInterval(refreshTimer);
  }
}


// Start from here
populateAllVideos();
