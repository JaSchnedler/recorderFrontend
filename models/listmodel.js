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

/*Audio request handler
* This function needs to be updated when data storage is added behind the node server.
* For now it returns a static audio file of roughly the size produced by a consultation
* Notes about future implementation:
* pass an object id from client side, based on that determine path return that file.
* */

exports.retrieveFile = function (objID, req, res) {
    /*
    *   var db = req.db;
        var collection = db.get('filecollection');
        var query = {_id : objID};
        collection.findOne(query, function (err, result) {
        if(err){
            console.log(err);
        }else{
            res.sendFile(result.fileurl);
        }

    });
    *
    *
    * */
    res.sendFile('/audiofiles/file1.wav');
}
