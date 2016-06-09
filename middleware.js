var http = require('http');
var url = require('url') ;
var dgram = require('dgram');
var sys = require('util');
var exec = require('child_process').exec;

// UDP Robotino
var ROBOTINO_PORT = 8888;
var ROBOTINO_IP = '172.26.201.121';
var client = dgram.createSocket('udp4');

// UDP physical remote control
var REMOTE_PORT = 9999;
var REMOTE_IP = '172.26.201.1';
var server = dgram.createSocket('udp4');

var moveEnabled = true;
var soundEnabled = true;
var acceptUdpCmds = true;
var distanceUp = false;
var tilting = false;

var MOV_MODIFIER = 40;
var ROT_MODIFIER = 40;
var x = 0;
// var y = 0;
var r = 0;
// var message = new Buffer('x0y0r0');

// calls itself every 10ms and sends most recent movement data to Robotino
moveLoop();
function moveLoop() {
  if (moveEnabled)
    sendToRobotino("x" + x + "y0r" + r );
  setTimeout(function() {
    moveLoop();
  }, 10);
}

// HTTP API for remote control web client
var k =0;
http.createServer(function(request, response) {
  var cmd = request.url.split("/")[1];
  var param = request.url.split("/")[2];
  // console.log("command ", ++k, cmd, param);
  evalCmd(cmd, param);
  acceptUdpCmds = false;
  setTimeout(function() {
    acceptUdpCmds = true;
  }, 200);

  response.setHeader('Access-Control-Allow-Origin', 'http://172.26.201.1:3499');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.end();
}).listen(1337);

// UDP API for physical remote control robot
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function (message, remote) {
  var m = message.toString();
  // console.log(remote.address + ':' + remote.port +' - ' + message);
  // console.log(m.substring(1, m.length));
  var value = Number(m.substr(1, m.length));
  var cmd = m.charAt(0);
  if (cmd === "R") {
    if (acceptUdpCmds) setMoveSpeed(value);
  }
  else if (cmd === "M") {
    if (acceptUdpCmds) setRotSpeed(value);
  }
  else if (cmd === "T") {
    if (value === 1 && !tilting) {
      acceptUdpCmds = false;
      tilting = true;
    }
    if (value === 0 && tilting) {
      acceptUdpCmds = true;
      tilting = false;
    }
  }
  else if (cmd === "O") {
    if (value > 0 && !distanceUp) {
      acceptUdpCmds = false;
      distanceUp = true;
    }
    if (value === 0 && distanceUp) {
      acceptUdpCmds = true;
      distanceUp = false;
    }
    else acceptUdpCmds = true;
  }
});
server.bind(REMOTE_PORT, REMOTE_IP);

// send commands to Robotino
function sendToRobotino(msg) {
  console.log(msg);
  client.send(msg, 0, msg.length, ROBOTINO_PORT, ROBOTINO_IP, function(err, bytes) {
    if (err) throw err;
    // console.log('UDP message ' + msg + ' sent to ' + ROBOTINO_IP +':'+ ROBOTINO_PORT);
    // client.close();
  });
}


function evalCmd(cmd, param) {
  switch(cmd) {
    case "moveoff":
      moveEnabled = false;
      break;
    case "moveon":
      moveEnabled = true;
      break;
    case "soundoff":
      soundEnabled = false;
      break;
    case "soundon":
      soundEnabled = true;
      break;
    case "sound1":
      playSound("bird.mp3");
      break;
    case "sound2":
      playSound("bird.mp3");
      break;
    case "sound3":
      playSound("bird.mp3");
      break;
    case "move":
      setMoveSpeed(param);
      break;
    case "rotate":
      setRotSpeed(param);
      break;
  }
}

function setMoveSpeed(speed) {
  // console.log("change speed ", speed);
  x = MOV_MODIFIER * speed;
}
function setRotSpeed(speed) {
  r = ROT_MODIFIER * speed;
}

// var stdin = process.openStdin();
// stdin.addListener("data", function(d) {
//   sendToRobotino(new Buffer(d));
//   if (d === "z") sendToRobotino(new Buffer("x0y0r0"));
// });


// function playSound(url) {
//   console.log("playing sound " + url);
//   exec("mplayer sounds/" + url , puts);
// }
