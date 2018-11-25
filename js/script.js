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

/*
let db = firebase.database();

db.ref('users/eeB7lr84oHfqMntRDTZ0').set({
  name: "arthur",
});
*/

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
  return videos.filter(vid => vid.sentiment < -0.25);
}

// Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
// Also updates the graph to include the videos
function populateAllVideos(){
  $.get({
    url: "https://searchandprotech.lib.id/sayfezonefilter@dev/",
    success: function(item){
      allVideos = item;
      
      filteredVids = filterNegSentiments(item);
      // Actually get the videos

      addVideos(filteredVids);

      // Show all the items  on the graph
      let data1 = ["sentiment"]
      let x_labels = []
      for (var video of allVideos){
        data1.push(video.sentiment);
        let d = new Date(video.timestamp * 1000);
        x_labels.push(d.toUTCString());
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
    for (var resultObj of video.result){
      text+= resultObj.text.content;
      text+=" "
    }
    newVideo(text, video.sentiment, video.timestamp, video.video_link);
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
  let d = new Date(timestamp * 1000);
  newVideo.find(".timestamp").text(d.toUTCString())
  newVideo.find(".speech2text").text(text)
  newVideo.find(".vid-link").attr("src", link)
}


// Start from here
populateAllVideos();
