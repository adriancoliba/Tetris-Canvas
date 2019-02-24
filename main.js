let fps = 7.5;
let W = 432;
let H = 528;
let X = 0;
let Y = 0;
let gameStart;
const startMenu = document.getElementById("startGame");
const startBtn = document.querySelector("#startGame button");
const detailedInstructions = document.querySelector("#detailedInstructions");

iteration = 0;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
c.fillStyle="#000000";
c.fillRect(0,0,432,528);
let canvasData = c.getImageData(0,0,432,528);
c.putImageData(canvasData,0,0);

let gameStatus = {
    points: 0,
    fps: 7.5,
    boardW: 432,
    boardH: 528
}

let keyPresses = [ 0 ];

let storedFunctions = [];

const tetro = {
    position: {x: (W-48)/2,y:0},
    boundaryPoints: [ [ 18, 36, 54,{x:24,y:48},{x:48,y:48}], [ 48, 48, 48 ] ]
}

function Tetrominoe(imgSrc, xBound1, yBound1, xBound2, yBound2, xBound3, yBound3) {
    this.image = new Image();
    this.image.src = imgSrc,
    this.boundaryPoints = [ xBound1, yBound1, xBound2, yBound2, xBound3, yBound3 ]  
}

var tetroO = new Tetrominoe("images/tetromino_o.png", 12, 48, 36, 48, 36, 48);
var tetroT = new Tetrominoe("images/tetromino_t.png", 12, 48, 36, 48, 60, 48);
var tetroT1 = new Tetrominoe("images/tetromino_t1.png", 12, 48, 36, 72, 36, 72);
var tetroT2 = new Tetrominoe("images/tetromino_t2.png", 12, 24, 36, 48, 60, 24);
var tetroT3 = new Tetrominoe("images/tetromino_t3.png", 12, 72, 36, 48, 36, 48);
var tetroI = new Tetrominoe("images/tetromino_i.png", 12, 96, 12, 96, 12, 96);
var tetroI1 = new Tetrominoe("images/tetromino_i1.png", 12, 24, 36, 24, 84, 24);
var tetroJ = new Tetrominoe("images/tetromino_j.png", 12, 48, 36, 48, 60, 48);
var tetroJ1 = new Tetrominoe("images/tetromino_j1.png", 12, 72, 36, 72, 12, 72);
var tetroJ2 = new Tetrominoe("images/tetromino_j2.png", 12, 24, 36, 24, 60, 48);
var tetroJ3 = new Tetrominoe("images/tetromino_j3.png", 12, 72, 36, 24, 36, 24);
var tetroL = new Tetrominoe("images/tetromino_l.png", 12, 48, 36, 48, 60, 48);
var tetroL1 = new Tetrominoe("images/tetromino_l1.png", 12, 24, 36, 72, 36, 72);
var tetroL2 = new Tetrominoe("images/tetromino_l2.png", 12, 48, 36, 24, 60, 24);
var tetroL3 = new Tetrominoe("images/tetromino_l3.png", 12, 72, 36, 72, 36, 72);
var tetroZ = new Tetrominoe("images/tetromino_z.png", 12, 24, 36, 48, 60, 48);
var tetroZ1 = new Tetrominoe("images/tetromino_z1.png", 12, 72, 36, 48, 36, 48);
var tetroS = new Tetrominoe("images/tetromino_s.png", 12, 48, 36, 48, 60, 24);
var tetroS1 = new Tetrominoe("images/tetromino_s1.png", 12, 48, 36, 72, 36, 72);
var currTetro = new Tetrominoe("images/tetromino_o.png", 12, 48, 36, 48, 36, 48)

function rotateTetro() {
    if (currTetro == tetroJ) {
        currTetro = tetroJ1;
    } else if (currTetro == tetroJ1) {
        currTetro = tetroJ2;
    } else if (currTetro == tetroJ2) {
        currTetro = tetroJ3;
    } else if (currTetro == tetroJ3) {
        currTetro = tetroJ;
    } else if (currTetro == tetroT) {
        currTetro = tetroT1;
    } else if (currTetro == tetroT1) {
        currTetro = tetroT2;
    } else if (currTetro == tetroT2) {
        currTetro = tetroT3;
    } else if (currTetro == tetroT3) {
        currTetro = tetroT;
    } else if (currTetro == tetroI) {
        currTetro = tetroI1;
    } else if (currTetro == tetroI1) {
        currTetro = tetroI;
    } else if (currTetro == tetroL) {
        currTetro = tetroL1;
    } else if (currTetro == tetroL1) {
        currTetro = tetroL2;
    } else if (currTetro == tetroL2) {
        currTetro = tetroL3;
    } else if (currTetro == tetroL3) {
        currTetro = tetroL;
    } else if (currTetro == tetroS) {
        currTetro = tetroS1;
    } else if (currTetro == tetroS1) {
        currTetro = tetroS;
    } else if (currTetro == tetroZ) {
        currTetro = tetroZ1;
    } else if (currTetro == tetroZ1) {
        currTetro = tetroZ;
    }
}

function drawCanvas() {
    c.putImageData(canvasData,0,0);
}

function copyCanvas() {
    canvasData = c.getImageData(0,0,432,528);
}


function drawTetro(tetro,xpos,ypos) {
    c.drawImage(tetro,xpos,ypos);
}

function detectCollision() {
    getHitInfo();
    if (tetro.position.y + currTetro.image.height == H || (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] !=0 || currTetro.hit3.data[0] != 0)) {
        rowCheck();
        resetTetro();
        copyCanvas();
        iteration++;
    }
}

function rowCheck() {
    var imgDataArray = [ [], [], [], [], [], [], [] ];
    var positionArray = [ 516, 492, 468, 444, 420, 396, 372 ];
    for (var j=0; j<positionArray.length; j++) {
        for (var x=12; x<420; x+=24) {
            var imgData = c.getImageData(x,positionArray[j],1,1);
            imgDataArray[j].push(imgData);
        }
    }
    
    for (var m=0; m<imgDataArray.length; m++) {
        var rowChecked = checkRows(m,imgDataArray);
        if (rowChecked == true) {
            clearRow(m);
        }
    }

}
    
function checkRows(row, imgDataArray) {
    for (var i=0; i<imgDataArray[row].length; i++) {
        if (imgDataArray[row][i].data[0] == 0 && imgDataArray[row][i].data[1] == 0 && imgDataArray[row][i].data[2] == 0) {
            return false;
        }
    }
    return true;
}

function clearRow(row) {
    var arrayRow = [ 504, 480, 456, 432, 408, 384, 360 ];
    var savedCanvas = c.getImageData(0,0,W,arrayRow[row]);
    c.putImageData(savedCanvas,0,24);
    gameStatus.points+=100;
    var score = document.getElementById("score");
    score.innerHTML = "SCORE: " + gameStatus.points;
}

function resetTetro(){
    tetro.position.y = 0;
    currTetro = randomizeTetro();
    tetro.position.x = (W-48)/2;
}

// return a RANDOM tetrominoe ( return storedT[random] )
var storedT = [ tetroO, tetroI, tetroJ, tetroL, tetroT, tetroZ, tetroS ];
function randomizeTetro() {
    var randomTetro = Math.floor(Math.random()*7);
    return storedT[randomTetro];
}
// 

// 
function updateGameState() {
    drawCanvas();
    copyCanvas();
    tetro.position.y+=12;
    moveX();
    drawTetro(currTetro.image,tetro.position.x,tetro.position.y);
    detectCollision();
}

function getHitInfo() {
    currTetro.hit1 = c.getImageData(tetro.position.x+currTetro.boundaryPoints[0],tetro.position.y+currTetro.boundaryPoints[1]+1,1,1);
    currTetro.hit2 = c.getImageData(tetro.position.x+currTetro.boundaryPoints[2],tetro.position.y+currTetro.boundaryPoints[3]+1,1,1);
    currTetro.hit3 = c.getImageData(tetro.position.x+currTetro.boundaryPoints[4],tetro.position.y+currTetro.boundaryPoints[5]+1,1,1)   
}

function moveX(eraseArray) {
    tetro.position.x+=keyPresses[0];
    tetro.position.x = Math.max(0, Math.min(tetro.position.x, (W - currTetro.image.width)));
    keyPresses.unshift(0);
}

function dropDownTetro() {
    while (tetro.position.y != 0) {
        tetro.position.y+=12;
        getHitInfo();
        if (tetro.position.y + currTetro.image.height == H || (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] !=0 || currTetro.hit3.data[0] != 0)) {
            drawCanvas();
            drawTetro(currTetro.image,tetro.position.x,tetro.position.y);
            rowCheck();
            copyCanvas();
            resetTetro();
            iteration++;
        }
    }
}

function storeKey(ev) {
    arrows = ((ev.which))||((ev.keyCode));

    switch(arrows){
        case 32: // space
            dropDownTetro();
        case 37: // left arrow
            keyPresses.unshift(-24);
            break;
        case 38: // up arrow
            rotateTetro();
            break;
        case 39:  // right arrow
            keyPresses.unshift(24);
            break;
        case 40:  // down arrow
            tetro.position.y+=12;
            break;
            }
        }

//start game when button is clicked.
startBtn.addEventListener("click", () => {
    console.log("clicked");
    gameStart = setInterval(updateGameState, 1000 / fps); // this will start the game
    startMenu.style.display = "none";
    detailedInstructions.style.display = "block";

});


function buttonInstructions() {
    document.getElementById("demo").innerHTML = "The primary way to score points in Tetris is to clear lines by manipulating the pieces so that they fill horizontal row within the Matrix. As the pieces fall, your goal is to move and spin them so that they line up evenly at the bottom of the Matrix. To clear a line, every square of the row has to be filled. </br> </br> Tip: Fill in multiple lines at once for bonus points. Drop Tetriminos so that there is a gap at least two squares deep, then drop a J-Tetrimino or L-Tetrimino to clear two lines at once, for example.";
  }
    