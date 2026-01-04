const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//const slider = document.getElementById("slider");

canvasX = canvas.width;
canvasY = canvas.height;

let gridWidth = 10;
let gridHeight = 10;

const totalBlocks = 3;

const blockPadding = 3;
const blockSize = 30;

const blocks = [];
const availableBlocks = [];

let activeBlock = null;
let offsetX = 0;
let offsetY = 0;

let x = canvas.width / 2;
let y = canvas.height - 30;


function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateBlocks() {
    for (let c = 0; c < gridWidth; c++) {
        blocks[c] = [];
        for (let r = 0; r < gridHeight; r++) {
            blocks[c][r] = { x: 0, y: 0, color: "#bbbbbb", placed: false};

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
            availableBlocks[b] = { x: 0, y: 0, active: true, color: "#000000" };

            const blockX = (canvasX - 3 * (150 + blockSize)) / 2 + b * (150 + blockSize) + 75;
            const blockY = canvasY - 100;

            availableBlocks[b].x = blockX;
            availableBlocks[b].y = blockY;
        }
    } else {
        for (let b = 0; b < totalBlocks; b++) {
            if (!availableBlocks[b].active) {
                availableBlocks[b] = { x: 0, y: 0, active: true, color: getRandomHexColor() };

                const blockX = (canvasX - 3 * (150 + blockSize)) / 2 + b * (150 + blockSize) + 75;
                const blockY = canvasY - 100;

                availableBlocks[b].x = blockX;
                availableBlocks[b].y = blockY;
            }
        }
    }
}





function drawAvailableBlocks() {
    for (let b = 0; b < totalBlocks; b++) {
        ctx.beginPath();
            ctx.rect(availableBlocks[b].x, availableBlocks[b].y, blockSize, blockSize);
            ctx.fillStyle = availableBlocks[b].color;
            ctx.fill();
            ctx.closePath();
    }
}

function drawGrid() {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            ctx.beginPath();
            ctx.rect(blocks[c][r].x, blocks[c][r].y, blockSize, blockSize);

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
}

setInterval(draw, 10);




function blockCollision(x, y, block) {

    return (
        x >= block.x &&
        x <= block.x + blockSize &&
        y >= block.y &&
        y <= block.y + blockSize
    )

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

    const snap = getGridLocation(activeBlock.x + blockSize / 2, activeBlock.y + blockSize / 2)

    if (snap === null) {
        activeBlock = null;
        return;
    } else {
        snap.color = activeBlock.color;
        snap.placed = true;

        activeBlock.active = false;
        activeBlock = null;
    }

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
