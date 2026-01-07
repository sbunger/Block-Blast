const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const canvasX = canvas.width;
const canvasY = canvas.height;

let gridWidth = 5;
let gridHeight = 5;

const defaultColor = "#ffffff";
const backgroundColor = "#f1f1ee";

const totalBlocks = 3;

const blockPadding = 6;
const blockSize = 35;

const gridPadding = 20;

const blockSpacing = 190;
const blockY = 90;

let blocks = [];
let availableBlocks = [];

let activeBlock = null;
let offsetX = 0;
let offsetY = 0;

let score = 0;
let combo = 0;

const clearTime = 8;

let inPlay = "start";

// define all possible blocks
const shapes = [
    [
        [1]
    ],

    [
        [1, 1]
    ],

    [
        [1],
        [1]
    ],

    [
        [1, 0],
        [1, 1]
    ],

    [
        [1, 1],
        [1, 0]
    ],

    [
        [0, 1],
        [1, 0]
    ],

    [
        [1, 0],
        [0, 1]
    ],

    [
        [1, 1],
        [1, 1]
    ],

    [
        [1],
        [1],
        [1],
    ],

    [
        [1, 1],
        [1, 1],
        [1, 1],
    ],

    [
        [1],
        [1],
        [1],
        [1]
    ],

    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],

    [
        [1, 0],
        [1, 1],
        [1, 0]
    ],

    [
        [1, 1],
        [0, 1],
        [1, 1]
    ],

    [
        [1, 1, 1, 1]
    ],

    [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ],

    [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
    ]
]





function getRandomColor() {
    const colors = ["#ff9aa2", "#fff1a8", "#b5ead7", "#b8c0ff"];
    return colors[Math.floor(Math.random() * colors.length)]
}




function updateScore(r, c) {
    const linesScored = r.length + c.length;
    if (linesScored === 0) {
        combo = 0;
        return;
    }

    combo += linesScored;

    const basePoints = 100;

    score += linesScored * (basePoints * combo);
}

function generateBlocks() {
    for (let c = 0; c < gridWidth; c++) {
        blocks[c] = [];
        for (let r = 0; r < gridHeight; r++) {
            blocks[c][r] = { x: 0, y: 0, color: defaultColor, placed: false, clearing: false, gridTimer: 0};

            const blockX = (canvasX - gridWidth * (blockPadding + blockSize)) / 2 + (c * (blockSize + blockPadding));
            const blockY = (canvasY - gridHeight * (blockPadding + blockSize)) / 2 + (r * (blockSize + blockPadding));

            blocks[c][r].x = blockX;
            blocks[c][r].y = blockY;
        }
    }
}

generateBlocks();

function getBlockSize(shape) {
    return {
        width: shape[0].length * (blockSize + blockPadding) - blockPadding,
        height: shape.length * (blockSize + blockPadding) - blockPadding
    };
}

function createAvailableBlocks() {
    // creates availible blocks when used / gone (init)

    for (let b = 0; b < totalBlocks; b++) {
        if (!availableBlocks[b] || availableBlocks[b].active === false) {
            
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const block = getBlockSize(shape);

            availableBlocks[b] = {
                x: (canvasX / 2) - (b - 1) * blockSpacing - block.width / 2, // 'center' horizontally
                y: canvasY - blockY - block.height / 2, // center vertically
                active: true,
                color: getRandomColor(),
                shape: shape
            };
            
        }

    }
}

function resetBlockPos() {
    //active when block is let go outside of game area
    for (let b = 0; b < totalBlocks; b++) {

        const block = getBlockSize(availableBlocks[b].shape);

        availableBlocks[b].x = (canvasX / 2) - (b - 1) * blockSpacing - block.width / 2;
        availableBlocks[b].y = canvasY - blockY - block.height / 2;
    }
}

function updateClears() {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            const block = blocks[c][r];

            if (!block.clearing) continue;

            block.gridTimer -= 1;

            if (block.gridTimer <= 0) {
                block.clearing = false;
                block.color = defaultColor;
            }
        }
    }
}

function clearRow(r) {
    for (let i = 0; i < r.length; i++) {
        for (let c = 0; c < gridWidth; c++){
            blocks[c][r[i]].placed = false;
            blocks[c][r[i]].clearing = true;
            blocks[c][r[i]].gridTimer = clearTime; // frames
        }
    }
}

function clearColumn(c) {
    for (let i = 0; i < c.length; i++) {
        for (let r = 0; r < gridHeight; r++){
            blocks[c[i]][r].placed = false;
            blocks[c[i]][r].clearing = true;
            blocks[c[i]][r].gridTimer = clearTime; // frames
        }
    }
}

function checkRows() {
    let selectedRows = [];
    let selectedCols = [];

    for (let r = 0; r < gridHeight; r++) {
        let row = true;

        for (let c = 0; c < gridWidth; c++) {
            if (!blocks[c][r].placed) {
                row = false;
                break;
            }
        }

        if (row) {
            selectedRows.push(r);
        }
    }

    for (let c = 0; c < gridWidth; c++) {
        let col = true;

        for (let r = 0; r < gridHeight; r++) {
            if (!blocks[c][r].placed) {
                col = false;
                break;
            }
        }

        if (col) {
            selectedCols.push(c);
        }
    }

    updateScore(selectedRows, selectedCols);

    clearColumn(selectedCols);
    clearRow(selectedRows);
}

function canPlace(block, startCol, startRow) {
    for (let r = 0; r < block.shape.length; r++) {
        for (let c = 0; c < block.shape[r].length; c++) {
            if (!block.shape[r][c]) continue;

            const gridCol = startCol + c;
            const gridRow = startRow + r;

            if (gridCol >= gridWidth || gridRow >= gridHeight) return false;

            if (blocks[gridCol][gridRow].placed) return false;
        }
    }
    return true;
}



function gameCheck() {
    let spotOpen = 0;

    for (let b = 0; b < availableBlocks.length; b++) {
        const block = availableBlocks[b];
        if (!block.active) continue;
        for (let r = 0; r <= gridHeight - block.shape.length; r++) {
            for (let c = 0; c <= gridWidth - block.shape[0].length; c++) {
                if (canPlace(block, c, r)) {
                    spotOpen += 1;
                }
            }
        }

    }

    if (spotOpen == 0) {
        inPlay = "gameOver";
    }
}





// actual drawing

function drawBlock(x, y, h, w, r, color) {

    if (!(color == defaultColor)) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
    }

    ctx.beginPath();
    ctx.roundRect(x, y, h, w, r);
    ctx.fillStyle = color;
    ctx.fill();

    
    if (!(color == defaultColor)) {
        ctx.shadowColor = "transparent";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
    }

    ctx.closePath();
}

function drawAvailableBlocks() {
    for (let b = 0; b < totalBlocks; b++) {
        const block = availableBlocks[b]

        for (let r = 0; r < block.shape.length; r++) {
            for (let c = 0; c < block.shape[r].length; c++) {
                if (block.shape[r][c]) {
                    const x = (block.x + c * (blockSize + blockPadding));
                    const y = (block.y + r * (blockSize + blockPadding));

                    drawBlock(x, y, blockSize, blockSize, 5, block.color)
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "bold 25px Arial";

    ctx.textAlign = "left"; 
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#3d405b";
    ctx.fillText(`Score: ${score}`, 40, 60);

    if (combo > 0) {
        ctx.fillStyle = "#74789aff";
        ctx.textAlign = "right";
        ctx.fillText(`Combo: ${combo}`, canvasX - 40, 60);
    }
}

function drawGrid() {

    // BG
    ctx.beginPath();
    ctx.roundRect((canvasX - (gridWidth * (blockSize + blockPadding)) - gridPadding) / 2, (canvasY - (gridHeight * (blockSize + blockPadding)) - gridPadding) / 2, (gridWidth * (blockSize + blockPadding) - blockPadding) + gridPadding, (gridHeight * (blockSize + blockPadding) - blockPadding) + gridPadding, 8);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.closePath();

    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            if (!blocks[c][r].clearing) {
                drawBlock(blocks[c][r].x, blocks[c][r].y, blockSize, blockSize, 5, blocks[c][r].color);
            } else {
                let t = blocks[c][r].gridTimer / clearTime;

                const multiplier = t * 0.25 + 0.75;
                const newSize = multiplier * blockSize;
                
                ctx.globalAlpha = t;
                drawBlock(blocks[c][r].x + (blockSize - newSize) / 2, blocks[c][r].y + (blockSize - newSize) / 2, newSize, newSize, 5, blocks[c][r].color);

                ctx.globalAlpha = 1;
            }
        }
    }
}

function drawGameOver() {

    const overWidth = 180;
    const overHeight = 45;

    ctx.shadowColor = backgroundColor;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.roundRect((canvasX - overWidth) / 2 , 120 - overHeight / 2, overWidth, overHeight, 5);
    ctx.fillStyle = backgroundColor;
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect((canvasX - overWidth) / 2 , canvasY - 120 - overHeight / 2, overWidth, overHeight, 5);
    ctx.fillStyle = backgroundColor;
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.shadowColor = "transparent";
    
    ctx.closePath();

    ctx.font = "bold italic 25px Arial";
    ctx.fillStyle = "#3d405b";

    ctx.textBaseline = "middle"; 
    ctx.textAlign = "center"; 
    ctx.fillText(`Game Over!`, canvasX / 2, 120);

    ctx.fillStyle = "#74789aff";
    ctx.font = "bold 25px Arial";
    ctx.fillText(`Click to reset`, canvasX / 2, canvasY - 120);
}


function drawStart() {
    for (let c = 0; c < canvasX / blockSize - 4; c++) {
        for (let r = 0; r < canvasY / blockSize - 4; r++) {
            let tempColor = null;

            if (Math.floor(Math.random() * 2)) {
                tempColor = getRandomColor();
            } else {
                tempColor = defaultColor;
            }


            drawBlock(blockSize / 2 + c * (blockSize + blockPadding), blockSize / 2 + r * (blockSize + blockPadding), blockSize, blockSize, 5, tempColor);
        }
    }

    const overWidth = 6 * (blockSize + blockPadding);
    const overHeight = 2 * (blockSize + blockPadding);

    ctx.shadowColor = backgroundColor;
    ctx.shadowBlur = 16;

    ctx.beginPath();
    ctx.roundRect((canvasX - overWidth) / 2 + 1, (canvasY - overHeight) / 2 + 1, overWidth, overHeight, 5);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = defaultColor;
    ctx.stroke();

    ctx.shadowColor = "transparent";

    ctx.font = "bold 25px Arial";

    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#3d405b";
    ctx.fillText("Click to begin!", canvasX / 2, canvasY / 2);    
}





createAvailableBlocks();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (inPlay == "start") {
        drawStart();
    }

    if (inPlay == "game") {
        updateClears();

        drawGrid();
        drawScore();
        drawAvailableBlocks();

        gameCheck();
    }

    if (inPlay == "gameOver") {
        updateClears();

        drawGrid();
        drawScore();
        drawAvailableBlocks();

        drawGameOver();
    }
}

gameInterval = setInterval(draw, 500);




function blockCollision(x, y, block) {
    for (let r = 0; r < block.shape.length; r++) {
        for (let c = 0; c < block.shape[r].length; c++) {
            if (!block.shape[r][c]) continue;

            const blockX = block.x + c * (blockSize + blockPadding)
            const blockY = block.y + r * (blockSize + blockPadding)

            if (
                x >= blockX &&
                x <= blockX + blockSize &&
                y >= blockY &&
                y <= blockY + blockSize
            ) {
                return true;
            }
        }
    }
    return false;
}

function getGridLocation(x, y) {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            const block = blocks[c][r]

            if (
                x >= block.x &&
                x <= block.x + blockSize &&
                y >= block.y &&
                y <= block.y + blockSize
            ) {
                return block;
            } 
        }
    }
    return null;
}

function getPos(event) {
    const rect = canvas.getBoundingClientRect();

    const mouseX = Math.round(event.clientX - rect.left);
    const mouseY = Math.round(event.clientY - rect.top);

    return {
        mouseX, mouseY
    }
}


function newGame() {
    score = 0;
    combo = 0;
    availableBlocks = [];
    blocks = [];

    generateBlocks();
    createAvailableBlocks();

    inPlay = "game";
}





function stopDrag() {
    if (!activeBlock) return;

    for (let r = 0; r < activeBlock.shape.length; r++) {
        for (let c = 0; c < activeBlock.shape[r].length; c++) {
            if (!activeBlock.shape[r][c]) continue;

            const snap = getGridLocation((activeBlock.x + blockSize / 2) + c * (blockSize + blockPadding), (activeBlock.y + blockSize / 2) + r * (blockSize + blockPadding))

            if (snap === null || snap.placed == true) {
                activeBlock = null;

                resetBlockPos();
                return;
            }
        }
    }

    for (let r = 0; r < activeBlock.shape.length; r++) {
        for (let c = 0; c < activeBlock.shape[r].length; c++) {
            if (!activeBlock.shape[r][c]) continue;

            const snap = getGridLocation((activeBlock.x + blockSize / 2) + c * (blockSize + blockPadding), (activeBlock.y + blockSize / 2) + r * (blockSize + blockPadding))

            snap.placed = true;
            snap.color = activeBlock.color;
            
            activeBlock.active = false;
        }
    }
    
    activeBlock = null;

    checkRows();

    createAvailableBlocks();

    console.log("success");
}

canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const pos = getPos(event);

    if (inPlay === "start") {
        gameInterval = setInterval(draw, 10);
        inPlay = "game";
        return;
    }

    if (inPlay === "gameOver") {
        newGame();
        return;
    }
    
    for (let b = 0; b < totalBlocks; b++) {
        if (blockCollision(pos.mouseX, pos.mouseY, availableBlocks[b])) {
            activeBlock = availableBlocks[b];

            offsetX = pos.mouseX - activeBlock.x;
            offsetY = pos.mouseY - activeBlock.y;
        }
    }
});

canvas.addEventListener("pointermove", (event) => {
  if (!activeBlock) return;

  const pos = getPos(event);
  activeBlock.x = pos.mouseX - offsetX;
  activeBlock.y = pos.mouseY - offsetY;
});

canvas.addEventListener("pointerup", stopDrag);
canvas.addEventListener("pointerleave", stopDrag);
