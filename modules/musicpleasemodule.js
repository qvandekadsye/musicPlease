var config = require('../config.json');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

function getAlbums(req,res){
  console.log(config['path']);
  filesG = fs.readdirSync(config['path']).filter(function(file){
  return fs.statSync(path.join(config['path'], file)).isDirectory();
  });
  res.render('album',{albums:filesG});
}

function getTracks(req,res){
  console.log(req.params.album.toString());
  var currentdirPath = path.join(config['path'],req.params.album.toString());

  files = fs.readdirSync(currentdirPath).filter(function(file){
    return (file.indexOf(".mp3") !== -1 ||file.indexOf(".MP3")!== -1 ||file.indexOf(".m4a")!== -1||file.indexOf(".flac")!== -1 ||file.indexOf(".aac")!== -1)
  });

  dir = fs.readdirSync(currentdirPath).filter(function(file){
    return (fs.statSync(path.join(currentdirPath,file)).isDirectory())
    });

  res.render('pistes',{pistes:files, dossiers:dir, album:req.params.album});
}

function play(req, res){
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
}

function getAlbumCover(req,res){
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
         var mime = "image/jpg";
       }
       else if (test[0].indexOf(".png") !== -1) {
         var mime = "image/png";
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
       res.sendFile("/images/reiko404.png",{'root':path.join(__dirname,"../public")});
     }
    });


}

exports.getAlbums = getAlbums;
exports.getTracks = getTracks;
exports.play = play;
exports.getAlbumCover = getAlbumCover;
