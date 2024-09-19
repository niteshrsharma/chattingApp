const express= require("express");
const socket = require("socket.io");
const app=express();  

app.use(express.static("public"));
// this is my new comment for this project
let port = 8080;

let Server = app.listen(port, () =>{
    console.log("listening to port "+port);
})

let io=socket(Server);
let connection_num=0;

io.on("connection", (socket)=>{

    connection_num = connection_num+1;

    console.log(`Made connection to pc ${connection_num}`);

    socket.on("beginPath", (data)=>{
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data)=>{
        io.sockets.emit("drawStroke", data);
    })

    socket.on("redoUndo", (data)=>{
        io.sockets.emit("redoUndo", data)
    })
})

