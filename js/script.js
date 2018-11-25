let allVideos = [];
let filteredVideos = [];

function clickGraph(data){
  console.log(data.value);
  console.log(data.name);
  filteredVideos = [];

  for (var i = Math.max(0, data.index - 1); i < Math.min(allVideos.length, data.index + 2);i++){
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
  return videos.filter(vid => vid.sentimentData.documentSentiment.score < 1);
}

// Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
// Also updates the graph to include the videos
function populateAllVideos(){
  $.get({
    url: "https://searchandprotech.lib.id/sayfezonefilter@dev/",
    success: function(item){
      item = item.filter(vid => "sentimentData" in vid);
      
      allVidsWithDates = item.map(function (x){
        x.date = new Date(x.timestamp);
        return x;
      });
      allVidsWithDates.sort(function(x, y){
        return x.timestamp - y.timestamp;
      });
      allVideos = allVidsWithDates;

      filteredVids = filterNegSentiments(item);

      // Actually get the videos

      addVideos(filteredVids);

      // Show all the items  on the graph
      let data1 = ["sentiment"]
      let x_labels = ["Lavels"]
      for(let i = 0;i<allVideos.length;i+=Math.max(1, Math.ceil(allVideos.length / 10))){
        let video = allVideos[i];
        data1.push(video.sentimentData.documentSentiment.score);
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
            categories: x_labels
          }
        },
      });
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
    newVideo(text, video.sentimentData.documentSentiment.score, video.date, video.video_link);
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
}


// Start from here
populateAllVideos();
