//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
// const about = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

require('dotenv').config();
mongoose.connect(process.env.mongodb_key);

var posts = mongoose.model("posts", {
  postTitle: String,
  postContent: String,
  lodash_: String
});

function giveContent(topicName){
  if(topicName === "about"){
    return "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
  }
  else if (topicName === "contact") {
    return "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
  }
  else if(topicName === "home"){
    return "add '/compose' to the URL above and add new posts...........Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
  }
}

app.get("/", (req, res) => {
  posts.find().then((result)=>{
      res.render("home", {Content: giveContent("home"), postsList: result});
  }).catch((err)=>console.log(err));

});

app.get("/:topic", (req, res) => {
  const t = req.params.topic;
  res.render(t, {Content: giveContent(t)});
});

app.get("/posts/:topic", (req, res) => {
  const topic = _.lowerCase(req.params.topic);

  //
  // // posts.forEach((element) => {
  // //   if(_.lowerCase(element.title) === topic){
  // //     found = true;
  // //     res.render("post", {postTitle: element.title, postContent: element.content});
  // //   }
  // // })
  //

  posts.find({lodash_: topic}).then((result)=>{
    if(result.length === 0){
      res.render("post", {postTitle: "Oops!...", postContent: "The post you are searching, does not exists.....try again."});
    }
    else{
      res.render("post", {postTitle: result[0].postTitle, postContent: result[0].postContent});
    }
  }).catch((err)=>console.log(err));

});

// app.get("/contact", (req, res) => {
//   res.render("contact", {contactContent: contactContent});
// });

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req,res) => {

  const post = new posts({postTitle: req.body.postTitle, postContent: req.body.postBody, lodash_: _.lowerCase(req.body.postTitle)});

  // const post = {
  //   title : req.body.postTitle,
  //   content : req.body.postBody
  // };

  // posts.push(post);

  post.save();

  res.redirect("/");
});







app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
