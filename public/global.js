const debug = true;

var ipAddress = "nclgames.it";
var port = "80";

if(debug) {
    ipAddress = "localhost";
    port = 3000;
}

module.exports = {
    ipAddress: ipAddress,
    port: port
}