var async     = require('async');
var fileType  = require('file-type');
var fs        = require('fs');
var mkdirp    = require('mkdirp');
var readChunk = require('read-chunk');
var request   = require('request');

var outputDir = 'icons';
mkdirp(outputDir);
var ids = [];
var sizes = [16, 22, 24, 32, 48, 64, 128];

for (var i = 0; i <= 20680; ++i) {
  ids.push(i);
}

async.eachSeries(ids, function (id, idCB) {
  console.log(id);
  downloadIcon(id, function () {
    idCB();
  });
}, function (err) {
  console.log('DONE');
});


function downloadIcon(id, cb) {
  async.eachSeries(sizes, function (size, sizeCB) {
    var url = `https://www.iconfinder.com/icons/${id}/download/png/${size}`;
    var filename = `${outputDir}/${id}_${size}.png`;
    download(url, filename, sizeCB);
  }, function (err) {
    cb();
  });
}

function download(url, filename, cb) {
  request(url).pipe(fs.createWriteStream(filename)).on('close', function () {
    var buffer = readChunk.sync(filename, 0, 262); 
    var ft = fileType(buffer);
    if (!ft) fs.unlinkSync(filename);
    cb(ft ? 'stop' : null);
  });
};

//download('https://www.iconfinder.com/icons/1/download/png/111', 'asd.png', function () {})
