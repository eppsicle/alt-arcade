let serial;
let latestData = "waiting for data";

let sensor1 = 0;

let speedTimer = 0;

let screenWidth = 600;

let score1 = 0;
let score2 = 0;

let gameOver = false;

var xBall = 300;
var yBall = 100;
var xSpeed = 4;
var ySpeed = -2;

function setup() {
  createCanvas(screenWidth, screenWidth / 2);

  dividers = new Group();
  dividers.height = screenWidth / 160;
  dividers.width = screenWidth / 160;
  dividers.x = screenWidth / 2;

  dividers.collider = "none";
  dividers.color = "white";

  while (dividers.length < screenWidth / 10) {
    let divider = new dividers.Sprite();
    divider.y = dividers.length * 10;
  }

  paddle1 = new Sprite();
  paddle1.height = screenWidth / 7;
  paddle1.width = screenWidth / 49;
  paddle1.collider = "static";
  paddle1.color = "white";
  paddle1.x = screenWidth / 50;

  paddle2 = new Sprite();
  paddle2.height = screenWidth / 7;
  paddle2.width = screenWidth / 49;
  paddle2.collider = "static";
  paddle2.color = "white";
  paddle2.x = screenWidth - screenWidth / 50;

  ball = new Sprite();
  ball.height = screenWidth / 49;
  ball.width = screenWidth / 49;
  ball.collider = "dynamic";
  ball.color = "white";

  topWall = new Sprite();
  topWall.height = 20;
  topWall.width = screenWidth;
  topWall.collider = "static";
  topWall.x = screenWidth / 2;
  topWall.y = -10;
  topWall.color = "black";

  bottomWall = new Sprite();
  bottomWall.height = 20;
  bottomWall.width = screenWidth;
  bottomWall.collider = "static";
  bottomWall.x = screenWidth / 2;
  bottomWall.y = screenWidth / 2 + 10;
  bottomWall.color = "black";

  serial = new p5.SerialPort();

  serial.list();
  //port that allows for serial communication
  serial.open("/dev/tty.usbmodem142101");

  serial.on("connected", serverConnected);

  serial.on("list", gotList);

  serial.on("data", gotData);

  serial.on("error", gotError);

  serial.on("open", gotOpen);

  serial.on("close", gotClose);
}

function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  //read string coming into serial port
  let currentString = serial.readLine();

  //if we have data
  if (currentString.length > 0) {
    //split at the comma
    let sensorArray = split(currentString, ",");

    //set variables equal to appropriate index of the array
    sensor1 = int(sensorArray[0]);
  }
  trim(currentString);
  if (!currentString) return;
  latestData = currentString;
}

function bounce() {
  // if (xBall < 10 ||
  //   xBall > 400 - 10) {
  //   xSpeed *= -1;
  // }
  if (yBall < 10 || yBall > screenWidth / 2 - 10) {
    ySpeed *= -1;
  }
}

function move() {
  xBall += xSpeed;
  yBall += ySpeed;
}

function bouncePaddle() {
  if (abs(yBall - paddle2.y) <= paddle2.height && abs(paddle2.x - xBall) < 5) {
    xSpeed *= -1;
    coinFlip = Math.floor(Math.random() * 2);
    if (coinFlip == 1){
      ySpeed *= -1;
    }
  }

  if (abs(yBall - paddle1.y) <= paddle1.height && abs(paddle1.x - xBall) < 5) {
    xSpeed *= -1;
    coinFlip = Math.floor(Math.random() * 2);
    if (coinFlip == 1){
      ySpeed *= -1;
    }
  }
}

function movePaddles() {
//   if (keyboard.pressing("w") && paddle1.y >= screenWidth / 13) {
//     paddle1.y -= 5;
//     paddle2.y -= 5;
//   }

//   if (
//     keyboard.pressing("s") &&
//     paddle1.y <= screenWidth / 2 - screenWidth / 13
//   ) {
//     paddle1.y += 5;
//     paddle2.y += 5;
//   }
  
  mappedSensor = map(sensor1, 0, 1023, screenWidth/13, screenWidth/2 - screenWidth/13);
  paddle1.y = mappedSensor;
  paddle2.y = mappedSensor;
}

function setBall() {
  ball.x = xBall;
  ball.y = yBall;
  ball.vel.x = xSpeed;
  ball.vel.y = ySpeed;
}

function score() {
  if (xBall > screenWidth + 50) {
    xBall = 300;
    yBall = 100;
    xSpeed = (1, 4);
    ySpeed = (-8, -2);
    score1 += 1;
  }
  if (xBall < -50) {
    xBall = 300;
    yBall = 100;
    xSpeed = (-1, -4);
    ySpeed = (-8, -2);
    score2 += 1;
  }
}

function increaseSpeed() {
  speedTimer += 1;
  if ((speedTimer / 60) % 5 == 0) {
    xSpeed *= 1.1;
    ySpeed *= 1.1;
  }
}

function draw() {
  clear();
  background(0);
  noStroke();

  //set up the text style
  textFont("Helvetica", screenWidth / 15);
  textStyle("bold");
  textAlign("center");
  fill("white");

  //write the endGame text on the screen
  text(score1, screenWidth / 3, screenWidth / 14);
  text(score2, (2 * screenWidth) / 3, screenWidth / 14);

  movePaddles();
  setBall();
  bounce();
  move();
  bouncePaddle();
  score();
  increaseSpeed();
}
