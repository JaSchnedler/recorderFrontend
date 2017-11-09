var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var assert = require("assert");
var fs = require("fs");
var ObjectId = require('mongodb').ObjectId;


exports.getUserInfo = function (req, res) {
    var db = req.db;
    var collection = db.collection('usercollection');
    var query = {ssn : req.params.id};
    collection.find(query).toArray( function (err, result) {
        res.json(result);
    });
};

exports.getFileInfo = function (id, req, res) {
    var db = req.db;
    var collection = db.collection('fs.files');
    var o_id = new ObjectId(id);
    var query = {_id:o_id};
    collection.findOne(query, function (err, result) {
        if(err) {
            console.log(err.message);
            res.sendStatus(404);
        }
        res.json(result);
        //console.log('FILEINFO:');
        //console.log(result);
    })
};

exports.getOwnedSoundFiles = function (owner, req, res) {
      var db = req.db;
      var collection = db.collection('usercollection');
      var query = {ssn : owner};
      collection.find(query).toArray( function (err, result) {
          if(err) throw err;
          res.json(result[0].soundfiles);
      });
};

exports.deleteFileByObjectID = function (objID, req, res) {
    console.log('delete file by object ID function');

    var db = req.db;
    var collection = db.get('fs.files');
    var o_id = new ObjectId(objID);
    var query = {_id : o_id};
    /*
    collection.findByIdAndRemove(query, function (err) {
        if(err){
            console.log(err.message);
        }else{
            console.log('File deleted');
        }
    });
    */
};
function removeFromUser(objId, ssn, req) {
    var db = req.db;
    var collection = db.collection('usercollection');
    var o_id = new ObjectId(objId);
    var query = {ssn: ssn};
    console.log('trying to remove from user list now');

    collection.findOneAndUpdate(query, {$pull: { soundfiles: o_id}}, function (err, data) {
        if(err) console.log(err.message);
        console.log(data);

    });
};

/*Audio request handler*/

exports.retrieveFile = function (id, req, res) {
    var db = req.db;
    var o_id = new ObjectId(id);

    var collection = db.collection('fs.files');
    console.log('id: ' + id);
    collection.findOne({_id: o_id}, function (err, result) {
        console.log('found it');
        if(err) {
            console.log('ERROR');
            throw err;

        }else{
            var bucket = new mongo.GridFSBucket(db); //default bucket = fs
            res.setHeader('Content-type', 'audio/wav');
            res.setHeader('Accept-Ranges', 'bytes');
            bucket.openDownloadStream(o_id).pipe(res).on('error', function (error) {
            console.log('error');
             }).on('finish', function () {
                console.log('success retrieving file!');
    });
        }

    });

};
