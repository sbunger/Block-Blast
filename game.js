const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//const slider = document.getElementById("slider");

canvasX = canvas.width;
canvasY = canvas.height;

let gridWidth = 10;
let gridHeight = 10;

const totalBlocks = 3;

const blockPadding = 5;
const blockSize = 20;

const blocks = [];
const availableBlocks = [];

let activeBlock = null;
let offsetX = 0;
let offsetY = 0;

let x = canvas.width / 2;
let y = canvas.height - 30;

function generateBlocks() {
    for (let c = 0; c < gridWidth; c++) {
        blocks[c] = [];
        for (let r = 0; r < gridHeight; r++) {
            blocks[c][r] = { x: 0, y: 0, block: false };

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
        for (let b = 0; b < totalBlocks; b++) {
            availableBlocks[b] = { x: 0, y: 0, active: true };

            const blockX = (canvasX - 3 * (150 + blockSize)) / 2 + b * (150 + blockSize) + 75;
            const blockY = canvasY - 100;

            availableBlocks[b].x = blockX;
            availableBlocks[b].y = blockY;
        }
    } 
}

createAvailableBlocks()


function drawAvailableBlocks() {
    for (let b = 0; b < totalBlocks; b++) {
        ctx.beginPath();
            ctx.rect(availableBlocks[b].x, availableBlocks[b].y, blockSize, blockSize);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
    }
}

function drawGrid() {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            ctx.beginPath();
            ctx.rect(blocks[c][r].x, blocks[c][r].y, blockSize, blockSize);

            if (blocks[c][r].block == false) {
                ctx.fillStyle = "#9d9d9dff";
            } else {
                ctx.fillStyle = "#0095DD";
            }

            ctx.fill();
            ctx.closePath();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawAvailableBlocks();
}

setInterval(draw, 10);


function blockCollision(mouseX, mouseY, block) {

    return (
        mouseX >= block.x &&
        mouseX <= block.x + blockSize &&
        mouseY >= block.y &&
        mouseY <= block.y + blockSize
    )

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
    activeBlock = null;
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

// test grid sizes
//slider.addEventListener("input", () => {
//  const value = slider.value;
//  gridWidth = value;
//  gridHeight = value;
//  generateBlocks()
//});
