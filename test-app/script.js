d = {
  x: 45,
  y: 0,
  r: 60
};

function sendToServer() {
  console.log("send command ", d.x, d.y, d.r);
  $.post(
    "http://127.0.0.1:1337/x" + d.x + "y" + d.y + "r" + d.r
  );
}

window.addEventListener("keydown", function (e) {
  console.log("Key Pressed: " + String.fromCharCode(e.keyCode) + "   charCode: " + e.keyCode);

  switch (e.keyCode) {
    case 38:
      // up
      update(0, 100, 0);
      break;
    case 40:
      // down
      update(0, -100, 0);
      break;
    case 37:
      // left
      update(-100, 0, 0);
      break;
    case 39:
      // right
      update(100, 0, 0);
      break;
    case 39:
      // space
      update(100, 0, 0);
      break;
  }

}, true);

function update(x, y, r) {
  d.x = x;
  d.y = y;
  d.r = r;
  sendToServer();
}
