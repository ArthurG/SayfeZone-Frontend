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

let fakeData = 
  [
    {
      id:123,
      timestamp:1543064163,
      sentiment:-0.5,
      magnitutde:0.5,
      result: [ {    "text": {     "content": "This guy is a stupid ass butt."    },    "sentiment": {     "magnitude": 0.5,     "score": -0.5    }   },   {    "text": {     "content": "I wish he would die already."    },    "sentiment": {     "magnitude": 0.1,     "score": 0.1    }   },   {    "text": {     "content": "You're so dumb you dork."    },    "sentiment": {     "magnitude": 0.7,     "score": -0.7    }   },   {    "text": {     "content": "What is wrong with you?"    },    "sentiment": {     "magnitude": 0.6,     "score": -0.6    }   },   {    "text": {     "content": "Idiot."    },    "sentiment": {     "magnitude": 0.8,     "score": -0.8    }   }  ],
      video_link:"https://firebasestorage.googleapis.com/v0/b/sayfezone.appspot.com/o/WIN_20181124_04_16_43_Pro.mp4?alt=media&token=9fc66ef0-9742-4e10-aa47-55d5e0fc17f8"
    },
    {
      id:123,
      timestamp:1543064163,
      sentiment:0.5,
      magnitutde:0.5,
      result: [ {    "text": {     "content": "This guy is a stupid ass butt."    },    "sentiment": {     "magnitude": 0.5,     "score": -0.5    }   },   {    "text": {     "content": "I wish he would die already."    },    "sentiment": {     "magnitude": 0.1,     "score": 0.1    }   },   {    "text": {     "content": "You're so dumb you dork."    },    "sentiment": {     "magnitude": 0.7,     "score": -0.7    }   },   {    "text": {     "content": "What is wrong with you?"    },    "sentiment": {     "magnitude": 0.6,     "score": -0.6    }   },   {    "text": {     "content": "Idiot."    },    "sentiment": {     "magnitude": 0.8,     "score": -0.8    }   }  ],
      video_link:"https://firebasestorage.googleapis.com/v0/b/sayfezone.appspot.com/o/WIN_20181124_04_16_43_Pro.mp4?alt=media&token=9fc66ef0-9742-4e10-aa47-55d5e0fc17f8"
    }
  ]

// Funcition to test newVideo. Do not call
function copyVideo() {
  newVideo("I really like cake... and pie", 12, "Nov 24, 2018 9:55AM");
}

// Deletes all the videos in the row
function deleteAllVideos(){
  $("#addVideos").children().empty();
}

// Hits an endpoint to get all the video data. Then, populates the video onto the DOM. 
// Also updates the graph to include the videos
function getAllVideos(){
  for (var video of fakeData){
    let text = "";
    for (var resultObj of video.result){
      text+= resultObj.text.content;
      text+=" "
    }
    newVideo(text, video.sentiment, video.timestamp, video.video_link);
  }

  let data1 = ["sentiment"]
  let x_labels = []
  for (var video of fakeData){
    data1.push(video.sentiment);
    let d = new Date(video.timestamp);
    x_labels.push(d.toUTCString());
  }


  var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        data1
      ],
      onclick: function (data) { 
        console.log(data.value);
        console.log(data.name);
      },
    },
    axis: {
      x: {
        type: 'category',
        x_labels
      }
    },
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
  newVideo.find(".timestamp").text(d.toUTCString())
  newVideo.find(".speech2text").text(text)
}
