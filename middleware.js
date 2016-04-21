var http = require('http');
var url = require('url') ;
var dgram = require('dgram');

var client = dgram.createSocket('udp4');

var PORT = 8888;
var HOST = '172.26.201.121';

var x, y, r; // x, y and rotation speed
var message = new Buffer('x0y0r0');

var k =0;
http.createServer(function(request, response) {
  console.log("command ", ++k);
  var cmd = request.url.split("/")[1];
  console.log(cmd);
  sendToRobot(new Buffer(cmd));

  response.setHeader('Access-Control-Allow-Origin', '172.26.201.2:1337');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.end();
}).listen(1337);

function updateSpeeds(x, y, r) {
  console.log(x, y, r);
}

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
  sendToRobot(new Buffer(d));
  if (d === "z") sendToRobot(new Buffer("x0y0r0"));
});

function sendToRobot(msg) {
  client.send(msg, 0, msg.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message ' + msg + ' sent to ' + HOST +':'+ PORT);
    // client.close();
  });
}
