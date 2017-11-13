var express = require('express');
var router = express.Router();
var listmodel = require('../models/listmodel');
var loginmodel = require('../models/loginmodel');
var receivefromrecorderModel = require('../models/receivefromrecordermodel');

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
    res.render('login', { title: 'Welcome to weRecord'});
});


router.get('/single:id',  function (req, res) {
    console.log('singleID');
    if(req.params.id !== undefined) {
        listmodel.getOwnedSoundFiles(req.params.id, req, res);
    }
});

router.post('/addUser',function (req, res) {
    receivefromrecorderModel.addUser(req, res);
});

router.post('/addfile', function (req, res) {
    receivefromrecorderModel.addFile(req, res);
});

router.get('/getaudio/:id',function (req, res) {
    var id = req.params.id.substr(1);
    if(id !== undefined) {
        listmodel.retrieveFile(id, req, res);
    }

});

router.get('/getaudiofilemetadata:id', function (req, res) {
    listmodel.getFileInfo(req.params.id,req, res);
});

router.post('/deletefile/:id/:ssn', function (req, res) {
    console.log('delete route matched');
    if(req.params.id !== undefined) {
        listmodel.deleteFileByObjectID(req.params.id, req.params.ssn, req, res);
    }
});

router.get('/search/:val/:ssn', function (req, res) {
    console.log('search route matched');
    listmodel.search(req, res);
});

module.exports = router;
