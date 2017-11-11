var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var GridStore = require('mongodb').GridStore;
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
      var collection = db.collection('fs.files');
      var query = {"metadata.owner" : owner};
      collection.find(query).toArray( function (err, result) {
          if(err) throw err;
          console.log(result);
          res.json(result);
      });
};

exports.deleteFileByObjectID = function (objID, req, res) {
    var db = req.db;
    var collection = db.collection('usercollection');
    var query2 = {ssn: req.params.ssn};
    console.log('trying to remove from user list now');
    var o_id = new ObjectId(objID);
    collection.findOneAndUpdate(query2, {$pull: { soundfiles: o_id}}, function (err, data) {
        if(err) console.log(err.message);

        console.log('entry removed from list');

        var o_id = new ObjectId(req.params.id);
        var query = {_id : o_id};
        collection = db.collection('fs.files');
        collection.remove(query, function (err) {
            if (err) console.log(err.message);
            console.log('file deleted.');
            res.sendStatus(200);
        });

    });
};
/*Audio request handler*/

exports.retrieveFile = function (id, req, res) {

    var db = req.db;
    var o_id = new ObjectId(id);

    var collection = db.collection('fs.files');
    console.log('id: ' + id);

    if(req.headers['range']){
        //console.log(req.headers);
        var beginning = req.headers['range'].slice(6,req.headers['range'].indexOf("-"));
        var ending = req.headers['range'].slice(req.headers['range'].indexOf("-")+1);
    }

    collection.findOne({_id: o_id}, function (err, result) {
        console.log('found it');
        if(err) console.log('ERROR');

        var bucket = new mongo.GridFSBucket(db); //default bucket = fs
        var downloadStream = bucket.openDownloadStream(o_id);

        downloadStream.pipe(res).once('finish', function (error) {
            console.log(error.err.message);
            console.log('file found in bucket')
        }).once('finish', function () {
            console.log('success retrieving file!');
            console.log(result.length);
            res.writeHead(206, {
                'Content-Range': 'bytes ' + beginning + '-' + ending + '/' + result.length,
                'Accept-Ranges': 'bytes',
                'Content-Length': result.length,
                'Content-Type': 'audio/wav'
            });
        });
    });

};

exports.search = function (req, res) {
    var collection = req.db.collection('fs.files');
    collection.find({$and: [{$text: {$search: req.params.val}}, {"metadata.owner": req.params.ssn}]}, {score: {$meta: "textScore"}}).toArray(function (err, result) {
        if(err) console.error(err);
        console.log(result);
        res.json(result);
    });
};

