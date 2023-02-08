let serial;
let latestData = "waiting for data";

//initialize the sensor value
let sensor1 = 0;

//initialize sound effect variable
let soundEffect;

//initialize the timer to track the speed of the ball
let speedTimer = 0;

//initialize the size of the screen
let screenWidth = 600;

//initialize the scores of players 1 and 2
let score1 = 0;
let score2 = 0;


//initialize the x and y position and speed of the ball
var xBall = 300;
var yBall = 100;
var xSpeed = 0.5;
var ySpeed = -0.5;

function setup() {
  //make the screen for the game
  createCanvas(screenWidth, screenWidth / 2);

  //load bouncing sound effect
  soundEffect = loadSound("pong-bounce.mp3");

  //create a group called dividers that draws a dotted line
  //across the middle of the screen
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

  //create the first paddle sprite and set its color, position, etc.
  paddle1 = new Sprite();
  paddle1.height = screenWidth / 7;
  paddle1.width = screenWidth / 49;
  paddle1.collider = "static";
  paddle1.color = "white";
  paddle1.x = screenWidth / 50;

  //create the second paddle sprite and set its color, position, etc.
  paddle2 = new Sprite();
  paddle2.height = screenWidth / 7;
  paddle2.width = screenWidth / 49;
  paddle2.collider = "static";
  paddle2.color = "white";
  paddle2.x = screenWidth - screenWidth / 50;

  //create the ball sprite and set its size, color, etc.
  ball = new Sprite();
  ball.height = screenWidth / 49;
  ball.width = screenWidth / 49;
  ball.collider = "dynamic";
  ball.color = "white";

  //create top wall sprite and set its size, location, etc.
  topWall = new Sprite();
  topWall.height = 20;
  topWall.width = screenWidth;
  topWall.collider = "static";
  topWall.x = screenWidth / 2;
  topWall.y = -10;
  topWall.color = "black";

  //create bottom wall sprite and set its size, location, etc.
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
  //if the ball gets close to the top or bottom walls, reverse the y-velocity of the ball
  if (yBall < 10 || yBall > screenWidth / 2 - 10) {
    ySpeed *= -1;
    //play sound effect
    soundEffect.play();
  }
}

function move() {
  //add the x and y speed values to the respective x and y positions of the ball
  xBall += xSpeed;
  yBall += ySpeed;
}

function bouncePaddle() {
  //if the ball is along the length of a paddle 2 and within 5 pixels of paddle 2...
  if (
    abs(yBall - paddle2.y) <= paddle2.height / 2 &&
    abs(paddle2.x - xBall) < 5
  ) {
    //play sound effect
    soundEffect.play();
    //reverse the x-velocity of the ball
    xSpeed *= -1;
    //spit out a random number between 1 and 0
    coinFlip = Math.floor(Math.random() * 2);
    //if that number is 1, also reverse the y-velocity of the ball
    if (coinFlip == 1) {
      ySpeed *= -1;
    }
  }

  //if the ball is along the length of a paddle 1 and within 5 pixels of paddle 1...
  if (
    abs(yBall - paddle1.y) <= paddle1.height / 2 &&
    abs(paddle1.x - xBall) < 5
  ) {
    //play sound effect
    soundEffect.play();
    //reverse the x-velocity of the ball
    xSpeed *= -1;
    //spit out a random number between 1 and 0
    coinFlip = Math.floor(Math.random() * 2);
    //if that number is 1, also reverse the y-velocity of the ball
    if (coinFlip == 1) {
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

  //map the value of the potentiometer to a vertical position that the paddles will be set to
  mappedSensor = map(
    sensor1,
    159,
    845,
    screenWidth / 2 - screenWidth / 13,
    screenWidth / 13
  );
  paddle1.y = mappedSensor;
  paddle2.y = mappedSensor;
}

function setBall() {
  //tell the ball what its position and speed is
  ball.x = xBall;
  ball.y = yBall;
  ball.vel.x = xSpeed;
  ball.vel.y = ySpeed;
}

function score() {
  //if the ball goes past the right paddle...
  if (xBall > screenWidth + 50) {
    //reset the ball's location and speed
    xBall = 300;
    yBall = 100;
    xSpeed = 0.5;
    ySpeed = -0.5;

    //add one point to player 1's score
    score1 += 1;
  }

  //if the ball goes past the left paddle...
  if (xBall < -50) {
    //reset the ball's location and speed
    xBall = 300;
    yBall = 100;
    xSpeed = 0.5;
    ySpeed = 0.5;

    //add one point to player 2's score
    score2 += 1;
  }
}

function increaseSpeed() {
  //add one to the speed timer every time the draw function runs, which is 60 times per second
  speedTimer += 1;

  //if a period of 5 seconds has passed...
  if ((speedTimer / 60) % 5 == 0) {
    //increase the x and y speed of the ball
    xSpeed *= 1.15;
    ySpeed *= 1.1;
  }
}

function draw() {
  //reset the screen
  clear();
  background(0);
  noStroke();

  //set up the text style
  textFont("Helvetica", screenWidth / 15);
  textStyle("bold");
  textAlign("center");
  fill("white");
  
  //display the scores
  text(score1, screenWidth / 3, screenWidth / 14);
  text(score2, (2 * screenWidth) / 3, screenWidth / 14);
  
  //if either player gets 4 points...
  if (score1 == 4 || score2 == 4) {
    //freeze the ball
    ball.vel.x = 0;
    ball.vel.y = 0;
    
    //if you press space, reset the game
    if (keyboard.presses(" ")) {
      score1 = 0;
      score2 = 0;
      ball.vel.x = xSpeed;
      ball.vel.y = ySpeed;
    }
  } else {
    
    //call all of the functions that run the game
    movePaddles();
    setBall();
    bounce();
    move();
    bouncePaddle();
    score();
    increaseSpeed();
  }
}
