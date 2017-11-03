var express = require('express');
var mongo = require('mongodb');
var router = express.Router();
var listmodel = require('../models/listmodel');
var loginmodel = require('../models/loginmodel');
var receivefromrecorderModel = require('../models/receivefromrecordermodel');
var fs = require("fs");

router.post('/app', function(req, res) {
    loginmodel.verifyUser(req.body.username, req.body.password, req, function (response, name, err) {
        if(response) {
            res.render('index.jade', {title: 'Welcome ' + name + '!', ssn: req.body.username});
        }else{
            res.redirect('/'); //should pass on a failed login attempt message or something
        }
    });
});

router.get('/', function (req, res) {
    console.log("get login");
    //console.log(req.db);
    res.render('login', { title: 'Welcome to weRecord'});
});


router.get('/single:id',  function (req, res) {
    console.log('singleID');
    //listmodel.getUserInfo(req, res);
    listmodel.getOwnedSoundFiles(req.params.id, req, res);
});


router.post('/adduser', function (req, res) {
    var db = req.db;
    var collection = db.collection('usercollection');
    collection.insert(req.body, function (err) {
        res.send(
            (err === null)? {msg:''} : {msg:err}
        );
    });
    return true;
});

router.delete('/deletefile:id', function (req, res) {

    listmodel.deleteFileByObjectID(req.params.id, req, res);

});

router.post('/modifyuser:id', function(req){
    var db = req.db;
    var collection = db.get('usercollection');
    var userToModify = {
        'id': req.params.id,
        'email':req.params.email,
        'ssn':req.params.name,
        'soundfiles':req.params.soundfiles
    };

    collection.update({_id:userToModify.id}, userToModify,   function(err, object) {
        if (err){
            console.warn(err.message);  // returns error if no matching object found
        }else{
            console.dir(object);
        }
    });

});

router.post('/user',function (req, res) {
    receivefromrecorderModel.addUser(req);
});

router.post('/addfile', function (req, res) {
    receivefromrecorderModel.getFile(req, res);
    res.status(200).redirect('/');
});

router.get('/getaudio',function (req, res) {
        var db = req.db;
        var collection = db.collection('fs.files');
        collection.findOne({filename: 'file1.wav'}, function (err, result) {
            console.log('found it');
            if(err) {
                console.log(err.message);
            }else{
                var bucket = new mongo.GridFSBucket(db); //default bucket = fs
                bucket.openDownloadStreamByName('file1.wav').pipe(fs.createWriteStream('./audiofiles/temp.wav')).on('error', function (error) {
                    console.log('error');
                }).on('finish', function () {
                    console.log('success!');
                })
            }

        });
});


module.exports = router;
