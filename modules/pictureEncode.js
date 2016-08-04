var fs = require('fs');
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('hex');
}

exports.pEncode = base64_encode;
