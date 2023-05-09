const debug = true;

var ipAddress = "16.16.193.226";
var port = "80";

if(debug) {
    ipAddress = "localhost";
    port = 3000;
}

module.exports = {
    ipAddress: ipAddress,
    port: port
}