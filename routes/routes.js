var express = require('express');
var mongo = require('mongodb');
var router = express.Router();
var listmodel = require('../models/listmodel');
var loginmodel = require('../models/loginmodel');
var receivefromrecorderModel = require('../models/receivefromrecordermodel');
var fs = require("fs");
var ObjectId = require('mongodb').ObjectId;

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

router.post('/addUser',function (req, res) {
    receivefromrecorderModel.addUser(req, res);
});

router.post('/addfile', function (req, res) {
    receivefromrecorderModel.addFile(req, res);
});

router.get('/getaudio/:id',function (req, res) {
    var id = req.params.id.substr(1);
    listmodel.retrieveFile(id, req, res);
    //console.log(res);

});

router.get('/getaudiofilemetadata:id', function (req, res) {
    listmodel.getFileInfo(req.params.id,req, res);
});

router.post('/deletefile/:id/:ssn', function (req, res) {
    console.log('delete route matched');
    listmodel.deleteFileByObjectID(req.params.id, req.params.ssn, req, res);
});

router.get('/search/:val/:ssn', function (req, res) {
    console.log('search route matched');
    listmodel.search(req, res);
});

module.exports = router;
