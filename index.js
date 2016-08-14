var express = require('express');
var session = require('express-session');
var path = require('path');
var app = express();
var config = require('./config.json');
var fs = require('fs');
var pe = require('./modules/pictureEncode.js');
var mup = require('./modules/musicpleasemodule.js');
var glob = require('glob');

var sess;
var filesG;

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/public')));
app.get('/', function(req,res) {
  res.render('index',{titre:"Music Please !"});
});

app.get('/about', function(req,res) {
  res.render('index',{titre:"About"});
});

app.get('/seconnecter', function(req,res){
  res.render('connexion');
});
app.post("/seconnecter",function(req,res){
  console.log("On se connecte");
  res.sendStatus("200");
});

app.get("/albums",mup.getAlbums);

app.get("/album/:album/:folder?",mup.getTracks);

app.get("/play/:album/:piste/:folder?", mup.play);


app.get("/cover/:album",mup.getAlbumCover);




app.listen(8080, function(){
  console.log("Program Kido");
});
