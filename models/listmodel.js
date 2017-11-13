var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;


exports.getUserInfo = function (req, res) {
    var db = req.db;
    var collection = db.collection('usercollection');
    if (collection !== undefined && db !== undefined) {
        var query = {ssn: req.params.id};
        collection.find(query).toArray(function (err, result) {
            res.json(result);
        });
    }
};

exports.getFileInfo = function (id, req, res) {
    var db = req.db;
    var collection = db.collection('fs.files');
    if (collection !== undefined && db !== undefined) {
        var o_id = new ObjectId(id);
        var query = {_id: o_id};
        collection.findOne(query, function (err, result) {
            if (err) {
                console.log(err.message);
                res.sendStatus(404);
            }
            res.json(result);
            //console.log('FILEINFO:');
            //console.log(result);
        })
    }
};

exports.getOwnedSoundFiles = function (owner, req, res) {
    var db = req.db;
    var collection = db.collection('fs.files');
    if (collection !== undefined && db !== undefined) {
        var query = {"metadata.owner": owner};
        collection.find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
        });
    }
};

exports.deleteFileByObjectID = function (objID, req, res) {
    var db = req.db;
    var collection = db.collection('usercollection');
    if (collection !== undefined && db !== undefined) {
        var query2 = {ssn: req.params.ssn};
        console.log('trying to remove from user list now');
        var o_id = new ObjectId(objID);
        collection.findOneAndUpdate(query2, {$pull: {soundfiles: o_id}}, function (err, data) {
            if (err) console.log(err.message);

            console.log('entry removed from list');

            var o_id = new ObjectId(req.params.id);
            var query = {_id: o_id};
            collection = db.collection('fs.files');
            collection.remove(query, function (err) {
                if (err) console.log(err.message);
                console.log('file deleted.');
                res.sendStatus(200);
            });

        });
    }
};
/*Audio request handler*/

exports.retrieveFile = function (id, req, res) {
    var db = req.db;
    var o_id = new ObjectId(id);
    var collection = db.collection('fs.files');
    if (collection !== undefined && db !== undefined) {
        collection.findOne({_id: o_id}, function (err, result) {
            console.log('found it');
            if (err) console.log('ERROR');

            var bucket = new mongo.GridFSBucket(db); //default bucket = fs
            console.log('id: ' + id);
            var range = req.headers.range;
            if (range) {
                var positions = range.replace(/bytes=/, "").split("-");
                var start = parseInt(positions[0], 10);
                var total = result.length;
                var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                var chunksize = (end - start) + 1;
                var downloadStream = bucket.openDownloadStream(o_id, {start: start}).end(end);

                res.writeHead(206, {
                    "Content-Range": "bytes " + start + "-" + end + "/" + total,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize,
                    "Content-Type": "video/wav"
                });

                downloadStream.pipe(res).once('finish', function (error) {
                    if (error) console.log(error.message);
                });
            }
        });
    }
};

exports.search = function (req, res) {
    var collection = req.db.collection('fs.files');
    if (collection !== undefined && req.params.ssn !== undefined && req.params.val !== undefined) {
        collection.find({$and: [{$text: {$search: req.params.val}}, {"metadata.owner": req.params.ssn}]}, {score: {$meta: "textScore"}}).toArray(function (err, result) {
            if (err) console.error(err);
            console.log(result);
            res.json(result);
        });
    } else {
        console.log('error, something is undefined');
    }
};

