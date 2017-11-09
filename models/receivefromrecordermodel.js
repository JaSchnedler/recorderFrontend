
var mongo = require('mongodb');
var fs = require("fs");
var assert = require("assert");
var path = require('path');
var formidable = require('formidable');
var ObjectId = require('mongodb').ObjectId;


exports.addUser = function (req, res) {
    var userData = {userdata:{}};
    var form = new formidable.IncomingForm();
    form.parse(req, function (err) {
        if(err) console.log(err.message);
    });


    form.on('field', function (name, value) {
       userData.userdata[name] = value;
    });

    form.on('end', function () {
        var db = req.db;
        var collection = db.collection('usercollection');
        var query = {ssn: userData.userdata.ssn};

        collection.update(query, {$set: userData},{upsert: true}, function (err, matchedCount) {
            if(err){
                    console.log(err.message);
            }else{
                if(matchedCount > 0){
                    res.send('user exists');
                }
                else{
                    res.send('user added');
                }
            }
        });

    });


};

exports.addFile = function (req, res) {
    var tempPath = './audiofiles/temp';
    var form = new formidable.IncomingForm({uploadDir: path.join(__dirname, '../', tempPath)});
    var metaData = {metadata: {}};
    var fileData = {filedata: {}};

    form.parse(req, function (err) {
        if (err) console.log(err.message);
    });
    form.on('field', function (name, value) {
        //console.log(name + value);
        metaData.metadata[name] = value;
    });

    form.on('file', function (name, file) {
        fileData.filedata['name'] = name;
        fileData.filedata['path'] = file.path;
    });

    form.on('end', function () {
        var db = req.db;
        var fileToSend = fileData.filedata.path;

        if (fs.existsSync(fileToSend)) {
            console.log('file exists - uploading to db');
            var bucket = new mongo.GridFSBucket(db);
            //retrieve relevant information from the upload sent from the pi and add it to the below metaData
            fs.createReadStream(fileToSend).pipe(bucket.openUploadStream(fileData.filedata.name, metaData).on('error', function (error) {
                assert.ifError(error);
            }).on('finish', function (resp) {
                console.log('uploaded file');
                addFileToUser(db, resp._id, resp.metadata.ssn);
                res.sendStatus(200);

                fs.unlink(fileToSend, function (err) {
                    if (err) console.log(err.message);
                });
            }));
        }
    });
};

function addFileToUser(db, id, owner){
    var DB = db;
    var o_id = new ObjectId(id);
    var collection = DB.collection('usercollection');
    var query = {ssn : owner};

    collection.findOneAndUpdate(query, {$push:{soundfiles: o_id}}, {upsert: false},function (err, data) {
        if (err) {
            console.log(err);
            console.log('not added anywhere');
        }
        console.log('added file to user');
    });


    }