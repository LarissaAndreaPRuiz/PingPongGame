const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//table size 
canvas.width = 1000;
canvas.height = 500;
const cw = canvas.width;
const ch = canvas.height;

const ballSize = 20; //ball size
let ballX = (cw / 2); //start ball positionX 
let ballY = (ch / 2); //start ball positionY

const racketHeight = 100; //racket height
const racketWidth = 15; //racket width

const playerX = 70; //player racket start positionX
const aiX = 910; //computer racket start positionX
let playerY = 200; //player racket start positionY
let aiY = 200; //computer racket start positionY

let ballSpeedX = 5; //ball speedX
let ballSpeedY = 5; //ball speedY
let playerSorce = 0;
let aiSorce = 0;

const scorePlayer = document.getElementById('playerPKT');
const scoreAi = document.getElementById('aiPKT');

let newGame = true;

//draw a player racket
function player() {
    ctx.fillStyle = "#b30000";
    ctx.fillRect(playerX, playerY, racketWidth, racketHeight);
}

//draw a computer racket
function computer() {
    ctx.fillStyle = "#2d231b";
    ctx.fillRect(aiX, aiY, racketWidth, racketHeight);
}

// draw a ball
function ball() {
    ctx.fillStyle = "orangered";
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0) {
        ballSpeedY *= -1;
        ballY = 0;
        speedUp();
    }

    if (ballY >= ch - ballSize) {
        ballSpeedY *= -1;
        ballY = ch - ballSize;
        speedUp();
    }

    if (ballX + ballSize >= cw) {
        reset(true);
    }

    if (ballX - ballSize <= 0) {
        reset(false);
    }

    if (ballY - ballSize / 2 <= 0 || ballY + ballSize / 2 >= ch) {
        ballSpeedY = -ballSpeedY;
        speedUp();
    }

    if (ballX - ballSize / 2 <= 0 || ballX + ballSize / 2 >= cw) {
        ballSpeedX = -ballSpeedX;
        speedUp();
    }

    if (ballX <= playerX + racketWidth &&
        ballX >= playerX &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + racketHeight) {
        ballSpeedX *= -1;
        ballX = playerX + racketWidth;
        speedUp();
    }

    if (ballX + ballSize >= aiX &&
        ballX + ballSize <= aiX + racketWidth &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + racketHeight) {
        ballSpeedX *= -1;
        ballX = aiX - ballSize;
        speedUp();
    }
}

//draw a table
function table() {
    //table 
    ctx.fillStyle = "#006622";
    ctx.fillRect(0, 0, cw, ch);
    //line
    for (let i = 0; i < ch; i += 30) {
        ctx.fillStyle = "white";
        ctx.fillRect(cw / 2 - 1.5, i, 3, 20)
    }
}
//mouse position
let topCanvas = canvas.offsetTop;

//mouse move
function playerPosition(event) {
    playerY = event.clientY - topCanvas - ((racketHeight / 2));

    if (playerY >= ch - racketHeight) {
        playerY = ch - racketHeight;
    }
    if (playerY <= 0) {
        playerY = 0;
    }
}

//ball acceleration
function speedUp() {
    //speed in the Y axis
    if (ballSpeedY > 0 && ballSpeedY < 16) {
        ballSpeedY += 0.2;
    } else if (ballSpeedY < 0 && ballSpeedY > -16) {
        ballSpeedY -= 0.2;
    }

    //speed in the X axis
    if (ballSpeedX > 0 && ballSpeedX < 16) {
        ballSpeedX += 0.2;
    } else if (ballSpeedX < 0 && ballSpeedX > -16) {
        ballSpeedX -= 0.2;
    }
}


//artificial intelligence
function aiPosition() {

    const racketMiddle = aiY + racketHeight / 2; //racket middle
    const ballMiddle = ballY + ballSize / 2; //ball middle

    if (ballX > 500) {
        if (racketMiddle - ballMiddle > 200) {
            aiY -= 20;
        } else if (racketMiddle - ballMiddle > 50) {
            aiY -= 10;
        } else if (racketMiddle - ballMiddle < -200) {
            aiY += 20;
        } else if (racketMiddle - ballMiddle < -50) {
            aiY += 10;
        }
    } else if (ballX <= 500 && ballX > 150) {
        if (racketMiddle - ballMiddle > 100) {
            aiY -= 5;
        } else if (racketMiddle - ballMiddle < -100) {
            aiY += 5;
        }
    }
}

function ballReset() {
    document.body.onkeyup = function(e) {
        if (e.keyCode == 32) {
            play();
            ctx.fillStyle = "orangered";
            ctx.beginPath();
            ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ballX = cw / 2;
            ballY = ch / 2;
        }
    }
}

function reset(who) {
    if (who) {
        scorePlayer.textContent = ++playerSorce;
        if (playerSorce >= 3 && aiSorce != 3) {
            alert(`Player wins!`);
            scorePlayer.textContent = 0;
            scoreAi.textContent = 0;
            newGame = false;
        }
    } else {
        scoreAi.textContent = ++aiSorce;
        if (aiSorce >= 3 && playerSorce != 3) {
            alert(`Computer wins!`);
            scorePlayer.textContent = 0;
            scoreAi.textContent = 0;
            newGame = false;
        }
    }
    newGame = true;
}

function play() {
    newGame = false;
    ballSpeedX = 3;
    ballSpeedY = 3;
}

canvas.addEventListener("mousemove", playerPosition);

function game() {
    table();
    if (!newGame) {
        ball();
    } else {
        ballReset();
    }
    player();
    computer();
    aiPosition();
}
setInterval(game, 1000 / 60);