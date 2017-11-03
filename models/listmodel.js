var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var assert = require("assert");
var fs = require("fs");

exports.getUserInfo = function (req, res) {
    var db = req.db;
    var collection = db.collection('usercollection');
    var query = {ssn : req.params.id};
    collection.find(query).toArray( function (err, result) {
        res.json(result);
    });
};

exports.getOwnedSoundFiles = function (owner, req, res) {
      var db = req.db;
      var collection = db.collection('filecollection');
      var query = {owner : owner};
      collection.find(query).toArray( function (err, result) {
          if(err) throw err;
          res.json(result);
          //console.log(result);
      });
};

exports.deleteFileByObjectID = function (objID, req) {
    var db = req.db;
    var collection = db.get('filecollection');
    var query = {_id : objID};
    collection.findByIdAndRemove(query, function (err) {
        if(err){
            console.log(err);
        }else{
            console.log('File deleted');
        }

    });

};

/*Audio request handler*/

exports.retrieveFile = function (objID, req, res) {
    console.log('retrievefile');
    var db = req.db;
    var filid = new ObjectId('59fb257fa61ce9dca62fc66f');
    var bucket = new mongo.GridFSBucket(db);
    console.log('objID: ');
    console.log(objID);
    bucket.openDownloadStream(objID).
    pipe(fs.createWriteStream('./output.wav')).
    on('error', function(error) {
        assert.ifError(error);
    }).
    on('finish', function() {
        console.log('done!');
        process.exit(0);
    });
};
