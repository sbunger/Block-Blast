const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const slider = document.getElementById("slider");

canvasX = canvas.width;
canvasY = canvas.height;

let gridWidth = 10;
let gridHeight = 10;

const blockPadding = 5;
const blockSize = 20;

const blocks = [];

let x = canvas.width / 2;
let y = canvas.height - 30;

function generateBlocks() {
    for (let c = 0; c < gridWidth; c++) {
        blocks[c] = [];
        for (let r = 0; r < gridHeight; r++) {
            blocks[c][r] = { x: 0, y: 0, block: false };
        }
    }
}

generateBlocks()


function drawGrid() {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            const blockX = (canvasX - gridWidth * (blockPadding + blockSize)) / 2 + (c * (blockSize + blockPadding));
            const blockY = (canvasX - gridHeight * (blockPadding + blockSize)) / 2 + (r * (blockSize + blockPadding));

            blocks[c][r].x = blockX;
            blocks[c][r].y = blockY;
            
            ctx.beginPath();
            ctx.rect(blockX, blockY, blockSize, blockSize);

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
}

setInterval(draw, 10);

function blockCollision(mouseX, mouseY) {
    for (let c = 0; c < gridWidth; c++) {
        for (let r = 0; r < gridHeight; r++) {
            if (
                mouseX >= blocks[c][r].x &&
                mouseX <= blocks[c][r].x + blockSize &&
                mouseY >= blocks[c][r].y &&
                mouseY <= blocks[c][r].y + blockSize
            ) {
                blocks[c][r].block = true;
            }
        }
    }
}

function clickHandler(event) {
    const rect = canvas.getBoundingClientRect();

    const mouseX = Math.round(event.clientX - rect.left);
    const mouseY = Math.round(event.clientY - rect.top);

    blockCollision(mouseX, mouseY);
}

canvas.addEventListener("click", (event) => clickHandler(event));

// test grid sizes
slider.addEventListener("input", () => {
  const value = slider.value;

  gridWidth = value;
  gridHeight = value;
  generateBlocks()
});
