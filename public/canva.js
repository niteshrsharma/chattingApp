let canvas = document.querySelector("canvas");
let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");

let undo = document.querySelector(".undo")
let redo = document.querySelector(".redo")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool = canvas.getContext("2d");

let undoRedoTracker = []//data of canvas container

let track = 0;

let penColor = "black";
let penWidth = pencilWidthElem.value;
let eraserWidth = pencilWidthElem.value;
tool.rect(0, 0, canvas.width, canvas.height);
tool.fillStyle = "white";
tool.fill();

console.log(penColor, penWidth, eraserWidth);


let isMouseDown = false;




tool.strokeStyle = penColor;
tool.lineWidth = "3";


canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;

    let data = {
        x: e.clientX,
        y: e.clientY
    }

    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? "white" : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }

        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);

    track = undoRedoTracker.length - 1;
})

undo.addEventListener("click", (e) => {
    if (track > 0) track--;

    let data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("redoUndo", data);
})

redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;

    let data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("redoUndo", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();

    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();

}

pencilColors.forEach((Pencolor) => {
    Pencolor.addEventListener("click", (e) => {
        let color = Pencolor.classList[0];
        color = color.split("-");
        color = color[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value * 1.2;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth * 3;
})

eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = "white";
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");

    a.href = url;
    a.download = "board.jpg";
    a.click();
})


socket.on("beginPath", (data) => {
    beginPath(data);
})

socket.on("drawStroke", (data)=>{
    drawStroke(data)
})

socket.on("redoUndo", (data)=>{
    undoRedoCanvas(data);
})