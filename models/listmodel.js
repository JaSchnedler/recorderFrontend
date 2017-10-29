exports.getUserInfo = function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    var query = {ssn : req.params.id};
    collection.find(query, function (err, result) {
        res.json(result);
    });
};

exports.getOwnedSoundFiles = function (owner, req, res) {
      var db = req.db;
      var collection = db.get('filecollection');
      var query = {owner : owner};
      collection.find(query, function (err, result) {
         res.json(result);
         //console.log(result);
      });
};

exports.deleteFileByObjectID = function (objID, req) {
    var db = req.db;
    var collection = db.get('filecollection');
    var query = {_id : objID};
    collection.findByIdAndRemove(query, function (err) {
        if(err){
            console.log(err);
        }else{
            console.log('File deleted');
        }

    });

};
