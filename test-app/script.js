var MOV_SPEED = 150;
var ROT_SPEED = 40;
var d = {
  x: 45,
  y: 0,
  r: 60
};

function sendToServer(x, y, r) {
  console.log("send command ", x, y, r);
  $.post(
    "http://127.0.0.1:1337/x" + x + "y" + y + "r" + r
  );
}

window.addEventListener("keydown", function (e) {
  console.log("Key Pressed: " + String.fromCharCode(e.keyCode) + "   charCode: " + e.keyCode);

  switch (e.keyCode) {
    case 38:
      // up
      update(0, MOV_SPEED, 0);
      break;
    case 40:
      // down
      update(0, -MOV_SPEED, 0);
      break;
    case 37:
      // left
      update(-MOV_SPEED, 0, 0);
      break;
    case 39:
      // right
      update(MOV_SPEED, 0, 0);
      break;
    case 32:
      // space = stop
      update(0, 0, 0);
      break;
    case 33:
      // pg up = turn right
      update(0, 0, ROT_SPEED);
      break;
    case 34:
      // pg down = turn left
      update(0, 0, -ROT_SPEED);
      break;

  }

}, true);


function update(x, y, r) {
  d.x = x;
  d.y = y;
  d.r = r;
  sendToServer(x, y, r);
}

$("#left").click(function() {
  update(-MOV_SPEED, 0, 0);
});
$("#up").click(function() {
  update(0, MOV_SPEED, 0);
});
$("#right").click(function() {
  update(MOV_SPEED, 0, 0);
});
$("#down").click(function() {
  update(0, -MOV_SPEED, 0);
});
$("#cl").click(function() {
  update(0, 0, -ROT_SPEED);
});
$("#ccl").click(function() {
  update(0, 0, ROT_SPEED);
});
$("#stop").click(function() {
  update(0, 0, 0);
});
