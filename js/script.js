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

function copyVideo(){
  newVideo("I really like cake... and pie", 12, "Nov 24, 2018 9:55AM");
}

function newVideo(text, sentiment, timestamp) {
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
  newVideo.find(".timestamp").text("Nov 24, 2018 9:55AM")
  newVideo.find(".speech2text").text("I really like cake.. And pie")
}
