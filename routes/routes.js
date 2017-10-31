var express = require('express');
var router = express.Router();
var listmodel = require('../models/listmodel');
var loginmodel = require('../models/loginmodel');


router.post('/app', function(req, res) {
    loginmodel.verifyUser(req.body.username, req.body.password, req, function (response, name) {
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



router.get('/audiofile', function (req, res) {

});

module.exports = router;
