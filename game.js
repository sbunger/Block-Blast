const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


canvasX = canvas.width;
canvasY = canvas.height;

let gridWidth = 5;
let gridHeight = 5;

const defaultColor = "#f4f1de";

const totalBlocks = 3;

const blockPadding = 4;
const blockSize = 40;
const blockSpacing = 130;

const blocks = [];
const availableBlocks = [];

let activeBlock = null;
let offsetX = 0;
let offsetY = 0;

let score = 0;

let x = canvas.width / 2;
let y = canvas.height - 30;

// define all possible blocks
const shapes = [
    [[1]],

    [[1, 1]],

    [
        [1, 0],
        [1, 1]
    ],

    [
        [1],
        [1],
        [1]
    ]
]



function getRandomColor() {
    const colors = ["#e07a5f", "#3d405b", "#81b29a", "#f2cc8f"];
    return colors[Math.floor(Math.random() * colors.length)]
}



function updateScore(r, c) {
    score = score + r.length + c.length;
}



function generateBlocks() {
    for (let c = 0; c < gridWidth; c++) {
        blocks[c] = [];
        for (let r = 0; r < gridHeight; r++) {
            blocks[c][r] = { x: 0, y: 0, color: defaultColor, placed: false};

            const blockX = (canvasX - gridWidth * (blockPadding + blockSize)) / 2 + (c * (blockSize + blockPadding));
            const blockY = (canvasX - gridHeight * (blockPadding + blockSize)) / 2 + (r * (blockSize + blockPadding));

            blocks[c][r].x = blockX;
            blocks[c][r].y = blockY;
        }
    }
}

generateBlocks();

function createAvailableBlocks() {
    if (availableBlocks.length === 0) {
        //init

        for (let b = 0; b < totalBlocks; b++) {
            availableBlocks[b] = { x: 0, y: 0, active: true, color: getRandomColor(), shape: shapes[Math.floor(Math.random() * shapes.length)] };
            

            const blockX = (canvasX - 3 * (150 + blockSize)) / 2 + b * (150 + blockSize) + 75;
            const blockY = canvasY - 150;

            availableBlocks[b].x = blockX;
            availableBlocks[b].y = blockY;
        }
    } else {
        //active when block is used
        for (let b = 0; b < totalBlocks; b++) {
            if (!availableBlocks[b].active) {
                availableBlocks[b] = { x: 0, y: 0, active: true, color: getRandomColor(), shape: shapes[Math.floor(Math.random() * shapes.length)] };

                const blockX = (canvasX - 3 * (150 + blockSize)) / 2 + b * (150 + blockSize) + 75;
                const blockY = canvasY - 150;

                availableBlocks[b].x = blockX;
                availableBlocks[b].y = blockY;
            }
        }
    }
}

function resetBlockPos() {
    //active when block is let go outside of game area
    for (let b = 0; b < totalBlocks; b++) {
        const blockX = (canvasX - 3 * (150 + blockSize)) / 2 + b * (150 + blockSize) + 75;
        const blockY = canvasY - 150;

        availableBlocks[b].x = blockX;
        availableBlocks[b].y = blockY;
    }
}

function clearRow(r) {
    for (let i = 0; i < r.length; i++) {
        for (let c = 0; c < gridWidth; c++){
            blocks[c][r[i]].placed = false;
            blocks[c][r[i]].color = defaultColor;
        }
    }
}

function clearColumn(c) {
    for (let i = 0; i < c.length; i++) {
        for (let r = 0; r < gridWidth; r++){
            blocks[c[i]][r].placed = false;
            blocks[c[i]][r].color = defaultColor;
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
    clearRow(selectedRows);
    clearColumn(selectedCols);
}



// actual drawing

function drawAvailableBlocks() {
    for (let b = 0; b < totalBlocks; b++) {
        const block = availableBlocks[b]

        for (let r = 0; r < block.shape.length; r++) {
            for (let c = 0; c < block.shape[r].length; c++) {
                if (block.shape[r][c]) {
                    const x = (block.x + c * (blockSize + blockPadding));
                    const y = (block.y + r * (blockSize + blockPadding));

                    ctx.beginPath();
                    ctx.roundRect(x, y, blockSize, blockSize, 5);
                    ctx.fillStyle = block.color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "bold italic 25px Arial";
    ctx.fillStyle = "#3d405b";
    ctx.fillText(`Score: ${score}`, 40, 60);
}

function drawGrid() {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            ctx.beginPath();
            ctx.roundRect(blocks[c][r].x, blocks[c][r].y, blockSize, blockSize, 5);

            ctx.fillStyle = blocks[c][r].color;

            ctx.fill();
            ctx.closePath();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    createAvailableBlocks()

    drawGrid();
    drawAvailableBlocks();
    drawScore();

    checkRows();
}

setInterval(draw, 10);




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

    console.log("success");
}

canvas.addEventListener("pointerdown", (event) => {
    const pos = getPos(event);
    
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
