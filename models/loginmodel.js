var crypto = require('crypto');

exports.verifyUser = function (passedssn, password, req, callback) {
    var collection = req.db.collection('usercollection');
    var query = {ssn: passedssn};
    if (collection !== undefined) {

        collection.findOne(query, function (err, result) {
            //console.log(result);
            if (result === null || result === undefined || result.password !== hash(password)) {
                return callback(false);
            } else {
                console.log('passsword match');
                return callback(true, result.name);
            }
        });
    }
};

function hash(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}