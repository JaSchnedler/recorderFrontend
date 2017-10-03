var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
    console.log("get userlist");
    return true;
});

router.get('/single:id',  function (req, res) {
   var db = req.db;
   console.log(req);
   var collection = db.get('usercollection');
   var query = {ssn : '8219181443'};
   collection.find(query, function (err, result) {
       console.log(result);
       res.json(result);
   })
});


router.post('/adduser', function (req, res) {
   var db = req.db;
   var collection = db.collection('usercollection');
   collection.insert(req.body, function (err, docs) {
      res.send(
          (err === null)? {msg:''} : {msg:err}
          );
   });
    return true;
    console.log("post ");

});

router.delete('/deleteuser:id', function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    var userToDelete = req.params.id;
    collection.remove({'_id':userToDelete}, function (err) {
        res.send((err===null) ? {msg: ''} : {msg: 'error:' + err});
    });
    return true;
    console.log("delete");

});

router.post('/modifyuser:id', function(req, res){
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

module.exports = router;

