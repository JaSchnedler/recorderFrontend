
var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var fs = require("fs");
var assert = require("assert");

exports.addUser = function (req, res) {
    var db = req.db;

    var collection = db.get('usercollection');
    var query = {ssn: req.ssn};
    collection.findOne(query, function (err, result) {
        if(err){
            var user = {
                'id': req.params.id,
                'email':req.params.email,
                'ssn':req.params.ssn,
                'password':req.params.password,
                'name':req.params.name
            };
            collection.insert(user, function (err) {
               if(err){console.warn(err.message);}
               console.log('User added');
            });
        }
    })
};

exports.addFile = function (req, res) {
    var db = req.db;
    var fileToSend = './audiofiles/file1.wav';
    if(fs.existsSync(fileToSend)) console.log('file exists');
    var bucket = new mongo.GridFSBucket(db);
    fs.createReadStream(fileToSend).pipe(bucket.openUploadStream('file1.wav')).on('error', function (error) {
        assert.ifError(error);
    }).on('finish', function () {
        console.log('uploaded file file1.wav');
        return res.redirect('/');
    });
};
