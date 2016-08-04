var express = require('express');
var session = require('express-session');
var path = require('path');
var app = express();
var config = require('./config.json');
var fs = require('fs');
var pe = require('./modules/pictureEncode.js');

var glob = require('glob');

var sess;
var filesG;

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/public')));
app.get('/', function(req,res) {
  res.render('index');
});

app.get('/about', function(req,res) {
  res.render('index');
});

app.get('/seconnecter', function(req,res){
  res.render('connexion');
});
app.post("/seconnecter",function(req,res){
  console.log("On se connecte");
  res.sendStatus("200");
});

app.get("/albums",function(req,res){
  console.log(config['path']);
  filesG = fs.readdirSync(config['path']).filter(function(file){
  return fs.statSync(path.join(config['path'], file)).isDirectory();
  });
  res.render('album',{albums:filesG});
});

app.get("/album/:album",function(req,res){
  console.log(req.params.album.toString());
  var currentdirPath = path.join(config['path'],req.params.album.toString());

  files = fs.readdirSync(currentdirPath).filter(function(file){
    return fs.statSync(path.join(currentdirPath,file)).isFile();
  });

  dir = fs.readdirSync(currentdirPath).filter(function(file){
    return fs.statSync(path.join(currentdirPath,file)).isDirectory();
    });

  res.render('pistes',{pistes:files, dossiers:dir, album:req.params.album});
});



app.get("/play/:album/:piste", function(req, res){
  var album = req.params.album;
  console.log("Album : "+album);
  var piste = req.params.piste;
  console.log("piste : " +piste);
  var path1 = path.join(config['path'],album);
  var fullpath = path.join(path1,piste);
  var stat = fs.statSync(fullpath);
  var range = req.headers.range;
  var redStream;
  if(range !== undefined)
  {
    var parts = range.replace(/bytes=/, "").split("-");

    var partial_start = parts[0];
    var partial_end = parts[1];

    var start = parseInt(partial_start, 10);
    var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
    var content_length = (end - start) + 1;

    res.status(206).header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': content_length,
      'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
    });
    readStream = fs.createReadStream(fullpath, {start: start, end: end});

  }
  else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(fullpath);
    }
    readStream.pipe(res);
});


app.get("/cover/:album",function(req,res){
  console.log(req.params.album.toString());
  var currentdirPath = path.join(config['path'],req.params.album.toString());
  var regexp = path.join(currentdirPath,config['coverFile']+".{jpg,png}");
  var test ;
   glob(regexp, function(er,files){
     test =files;
     console.log(test)
     if(test.length>0)
     {
       console.log(test[0].indexOf(".jpg") !== -1);

       if(test[0].indexOf(".jpg") !== -1)
       {
         console.log("toto");
         var mime = "image/jpg";
       }
       else if (test[0].indexOf(".png") !== -1) {
         var mime = "image/png";
         console.log("tata");
         }

         res.status(200).header({
           'Content-Type': mime
         });
         res.sendFile(test[0]);
     }
     else{
       res.status(404).header({
         'Content-Type': "image/png"
       });
       res.sendFile("images/reiko404.png",{'root':path.join(__dirname,"/public")});
     }
    });


});



app.get("/info",function(req,res){
  console.log("jean pierr");
  res.sendStatus(200);
});

app.listen(8080, function(){
  console.log("Program Kido");
});
